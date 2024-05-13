const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    username: { type: String, default: '' },
    name: { type: String, default: '' },
    lastname: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    zipcode: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    admin: { type: Boolean, default: false },
    aboutme: { type: String, default: '' },
    imagePath: { type: String, default: '' }
});

const UsersModel = mongoose.model('Users', UsersSchema);
module.exports = UsersModel;
