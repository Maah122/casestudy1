import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddStocks({ fetchStocks }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [available, setAvailable] = useState("No"); // Default to 'No'
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create form data object
    const formData = new FormData();

    // Append image file to form data
    formData.append("image", image);

    // Append other form fields to form data
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("available", available); // Keep it as string
    formData.append("rating", rating);
    formData.append("price", price);

    axios
      .post("http://localhost:3001/addstock", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
        },
      })
      .then((res) => {
        console.log(res);
        navigate("/admin/stocks"); // Redirect to tables
      })
      .catch((err) => console.log(err));
  };

  const handleCancel = () => {
    navigate("/admin/stocks");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <div className="d-flex vh-100 bg-custom-primary justify-content-center align-items-center">
      <div className="w-50 bg-custom-white rounded p-3 shadow">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-3">Available Games</h2>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              id="image"
              className="form-control"
              onChange={handleImageChange} // Changed to handleImageChange
              required
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
            Submit
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

export default AddStocks;
