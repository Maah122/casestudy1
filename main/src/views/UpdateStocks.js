import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateUser() {
  const { id } = useParams();

  // State variables
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [available, setAvailable] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch data from the server when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/get/stock/${id}`
        );
        console.log("response: ", response);
        const userData = response.data;
        console.log("User Data: ", userData);
        // Set state values with fetched data
        setTitle(userData.title);
        setGenre(userData.genre);
        setAvailable(userData.available);
        setRating(userData.rating);
        setPrice(userData.price);
        setImage(userData.imagePath);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData(); // Call the fetchData function
  }, [id]);

  const navigate = useNavigate();

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("available", available);
    formData.append("rating", rating);
    formData.append("price", price);

    try {
      const res = await axios.put(
        `http://localhost:3001/updatestock/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
      navigate("/admin/stocks");
    } catch (err) {
      console.error(err);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/admin/stocks");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Read the selected image file and convert it to a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      // Set the data URL as the source of the image
      const dataURL = event.target.result;
      setImagePreview(dataURL); // Update the state with the data URL
    };
    reader.readAsDataURL(file);
  };

  // JSX for rendering the component
  return (
    <div className="d-flex vh-100 bg-white justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3 shadow">
        <form onSubmit={handleUpdate}>
          <h2 className="mb-3">Update Game</h2>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Image
            </label>
            {(imagePreview || image) && (
              <img
                src={imagePreview || `http://localhost:3001/${image}`}
                alt="Preview"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              id="image"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter Title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="genre" className="form-label">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              placeholder="Enter Genre"
              className="form-control"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="available" className="form-label">
              Available
            </label>
            <select
              id="available"
              className="form-control"
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
              required
            >
              <option value="">Select Availability</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <select
              id="rating"
              className="form-control"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="">Select Rating</option>
              {[...Array(10)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="text"
              id="price"
              placeholder="Enter Price"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">
            Update
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
