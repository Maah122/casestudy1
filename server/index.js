const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const UsersModel = require("./models/Users");
const MembersModel = require("./models/members");
const StocksModel = require("./models/Stocks");


const app = express();
app.use(express.json());
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')))

mongoose.connect("mongodb://127.0.0.1:27017/game_rental");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Assuming you have the user's _id available in req.body
  const userId = req.body._id;
  const filePath = req.file.path;

  // Retrieve the user from the database to get the existing imagePath
  UsersModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete the existing image file if it exists
      if (user.imagePath) {
        fs.unlink(user.imagePath, (err) => {
          if (err) {
            console.error('Error deleting existing image:', err);
          }
        });
      }

      // Update the user's imagePath with the new filePath
      user.imagePath = filePath;

      // Save the updated user
      return user.save();
    })
    .then((updatedUser) => {
      return res.status(200).json({ message: 'Image uploaded successfully', user: updatedUser });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/', (req, res) => {
  MembersModel.find()
      .populate('stock') // Populate the 'stock' field with data from the 'Stocks' collection
      .then(users => res.json(users))
      .catch(err => res.json(err))
});


app.get('/get/:id', (req, res) => {
  const id = req.params.id;
  MembersModel.findById(id)
      .populate('stock') // Populate the 'stock' field with data from the 'Stocks' collection
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ error: 'User not found' }));
});


app.post('/create', (req, res) =>{
  const { name, stock, status } = req.body;
  MembersModel.create({ name, stock, status })
      .then(member => res.json(member))
      .catch(err => res.status(500).json({ error: err.message }));
});


app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  MembersModel.findByIdAndUpdate({ _id: id }, {
      name: req.body.name,
      stock: req.body.stock, // Changed from game to stock
      status: req.body.status
  }, { new: true }) // Set { new: true } to return the updated document
      .then(user => res.json(user))
      .catch(err => res.status(400).json({ error: err.message }));
});


app.delete('/deleteuser/:id', (req, res) =>{
  const id = req.params.id;
  MembersModel.findByIdAndDelete({ _id: id })
   .then(response => res.json(response))
   .catch(error => res.json(err))
});



app.get('/addstock', (req,res) => {
  StocksModel.find()
     .then(users=> res.json(users))
     .catch(err => res.json(err))
});

app.get('/get/stock/:id', (req, res) => {
  const id = req.params.id;
  StocksModel.findById(id)
    .then(user => res.json(user))
    .catch(err => res.status(404).json({ error: 'User not found' }));
});


app.post('/addstock', upload.single('image'), async (req, res) => {
  try {
    const { title, genre, available, rating, price } = req.body;
    console.log(req.file);
    const imagePath = req.file.path;

    // Create new stock document
    const newStock = new StocksModel({
      title,
      genre,
      available,
      rating,
      price,
      imagePath
    });

    // Save the new stock document to the database
    const savedStock = await newStock.save();
    
    res.status(201).json(savedStock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/updatestock/:id', upload.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, genre, available, rating, price } = req.body;
    const imagePath = req.file ? req.file.path : null; // Check if image is provided

    // Construct update object based on provided fields
    const updateFields = {};
    if (title) updateFields.title = title;
    if (genre) updateFields.genre = genre;
    if (available) updateFields.available = available;
    if (rating) updateFields.rating = rating;
    if (price) updateFields.price = price;
    if (imagePath) updateFields.imagePath = imagePath;

    // Update the stock in the database
    const updatedStock = await StocksModel.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedStock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json(updatedStock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/deletestock/:id', (req, res) =>{
  const id = req.params.id;
  StocksModel.findByIdAndDelete({ _id: id })
   .then(response => res.json(response))
   .catch(error => res.json(err))
});



app.post("/register", async (req, res) => {
  const { name, lastname, address, city, country, zipcode, email, password } = req.body;

  try {
    const existingUser = await UsersModel.findOne({ email: email });

    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      const newUser = new UsersModel({
        name: name,
        lastname: lastname,
        address: address, // Include address field here
        city: city, // Include city field here
        country: country, // Include country field here
        zipcode: zipcode, // Include zipcode field here
        email: email,
        password: password,
        admin: true,
      });

      await newUser.save();
      res.json({ message: "Registration successful" });
    } 
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/checkEmail/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const existingUser = await UsersModel.findOne({ email: email });

    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await UsersModel.findOne({ email: email });
  
      if (!user) {
        // User with the provided email does not exist
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
  
      if (user.password !== password) {
        // Password does not match
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
  
      // Login successful
      res.json({ message: "Success", data: user});
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

app.get("/user/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await UsersModel.findOne({ email: email });

    if (user) {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("server is running");
});

app.put('/user/update/:id', (req, res) => {
  const id = req.params.id;
  UsersModel.findByIdAndUpdate({ _id: id }, {
    name: req.body.name,
    lastname: req.body.lastname,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    zipcode: req.body.zipcode,
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin,
    aboutme: req.body.aboutme,
    username: req.body.username,
    imagePath: req.body.imagePath
  }).then(user => res.json(user))
   .catch(err => res.json(err))
});

app.get('/users', async (req, res) => {
  try {
      const users = await UsersModel.find({}, 'username'); // Fetch usernames only
      res.json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

app.get('/returned-members', async (req, res) => {
  try {
    const returnedMembers = await MembersModel.find({ status: 'Returned' }).populate('stock');
    const membersWithPrice = returnedMembers.map(member => ({
      ...member.toObject(),
      stock: {
        ...member.stock.toObject(),
        totalPrice: member.stock.price // Add the price of the stock to the returned member object
      }
    }));
    res.json(membersWithPrice);
  } catch (err) {
    console.error('Error fetching returned members:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/lost-members', async (req, res) => {
  try {
    const returnedMembers = await MembersModel.find({ status: 'Lost' }).populate('stock');
    const membersWithPrice = returnedMembers.map(member => ({
      ...member.toObject(),
      stock: {
        ...member.stock.toObject(),
        totalPrice: member.stock.price // Add the price of the stock to the returned member object
      }
    }));
    res.json(membersWithPrice);
  } catch (err) {
    console.error('Error fetching returned members:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/pending-members', async (req, res) => {
  try {
    const returnedMembers = await MembersModel.find({ status: 'Pending' }).populate('stock');
    const membersWithPrice = returnedMembers.map(member => ({
      ...member.toObject(),
      stock: {
        ...member.stock.toObject(),
        totalPrice: member.stock.price // Add the price of the stock to the returned member object
      }
    }));
    res.json(membersWithPrice);
  } catch (err) {
    console.error('Error fetching returned members:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/rented-members', async (req, res) => {
  try {
    const returnedMembers = await MembersModel.find({ status: 'Rented' }).populate('stock');
    const membersWithPrice = returnedMembers.map(member => ({
      ...member.toObject(),
      stock: {
        ...member.stock.toObject(),
        totalPrice: member.stock.price // Add the price of the stock to the returned member object
      }
    }));
    res.json(membersWithPrice);
  } catch (err) {
    console.error('Error fetching returned members:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


function getMonthDateRanges() {
  const year = new Date().getFullYear();
  return Array.from({ length: 12 }, (v, i) => {
    const start = new Date(year, i, 1);
    const end = new Date(year, i + 1, 0, 23, 59, 59);
    return { start, end };
  });
}

app.get('/:status-members-monthly', async (req, res) => {
  try {
    const status = capitalizeFirstLetter(req.params.status);
    console.log(status);
    const year = new Date().getFullYear(); // Filter data by the current year

    // Aggregate the data by month and calculate counts for each status
    const monthlyData = await MembersModel.aggregate([
      { 
        $match: { 
          status: status, 
          date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) } 
        } 
      },
      { 
        $group: { 
          _id: { month: { $month: "$date" }, status: "$status" }, 
          count: { $sum: 1 } 
        } 
      },
      { 
        $group: { 
          _id: "$_id.month",
          counts: { 
            $push: { 
              status: "$_id.status", 
              count: "$count" 
            } 
          } 
        } 
      },
      {
        $sort: { _id: 1 } // Sort by month (1 to 12)
      },
      {
        $project: {
          _id: 1,
          counts: {
            $concatArrays: [
              { $filter: { input: ["Lost", "Pending", "Rented"], as: "s", cond: { $not: { $in: ["$$s", "$counts.status"] } } } },
              "$counts"
            ]
          }
        }
      },
      {
        $unwind: "$counts"
      },
      {
        $group: {
          _id: "$_id",
          counts: { $push: "$counts" }
        }
      }
    ]);

    const formattedData = monthlyData.map(month => {
      const monthCounts = {};
      month.counts.forEach(statusCount => {
        monthCounts[statusCount.status] = statusCount.count;
      });
      return { month: month._id, counts: monthCounts };
    });

    // Fill in missing months with counts as 0
    for (let i = 1; i <= 12; i++) {
      const existingMonth = formattedData.find(item => item.month === i);
      if (!existingMonth) {
        formattedData.push({ month: i, counts: { Lost: 0, Pending: 0, Rented: 0 } });
      }
    }

    // Sort the formatted data by month
    formattedData.sort((a, b) => a.month - b.month);

    res.json(formattedData);
  } catch (error) {
    console.error(`Error fetching monthly data:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/total-members', async (req, res) => {
  try {
    const totalCounts = await MembersModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const totalCountsObject = {};
    totalCounts.forEach(({ _id, count }) => {
      totalCountsObject[_id] = count;
    });

    res.json(totalCountsObject);
  } catch (error) {
    console.error('Error fetching total members by status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}