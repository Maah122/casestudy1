import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle, FaShoppingCart, FaTimesCircle, FaArrowAltCircleLeft } from 'react-icons/fa'; // Import icons

function CreateUser() {
    const [name, setName] = useState('');
    const [stock, setStock] = useState('');
    const [status, setStatus] = useState('');
    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch stocks
        axios.get('http://localhost:3001/addstock')
            .then(res => {
                setStocks(res.data); // Assuming the response is an array of stock objects
            })
            .catch(err => console.error('Error fetching stocks:', err));
    }, []); // Empty dependency array to run the effect only once after initial render

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to create a member with associated user and stock
            await axios.post('http://localhost:3001/create', { name, stock, status });
            navigate('/admin/tables');
        } catch (error) {
            console.error('Error creating member:', error);
        }
    }

    const handleCancel = () => {
        navigate('/admin/tables');
    };

    return (
        <div className="d-flex vh-100 bg-custom-primary justify-content-center align-items-center">
            <div className="w-50 bg-custom-white rounded p-3 shadow">
                <form onSubmit={handleSubmit}>
                    <h2 className="mb-3">Add User</h2>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Name"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="game" className="form-label">Game Rented</label>
                        <select
                            id="game"
                            className="form-control"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        >
                            <option value="">Select Game</option>
                            {stocks.map(stock => (
                                <option key={stock._id} value={stock._id}>{stock.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Status</label>
                        <select
                            id="status"
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            style={{ color: status === 'Available' ? 'green' : status === 'Pending' ? 'orange' : status === 'Rented' ? 'blue' : status === 'Lost' ? 'red' : status === 'Returned' ? 'purple' : 'black' }} // Apply different colors
                        >
                            <option value="">Select Status</option>
                            {/* <option value="Available"> <FaCheckCircle /> Available</option> */}
                            <option value="Pending"> <FaExclamationCircle /> Pending</option>
                            <option value="Rented"> <FaShoppingCart /> Rented</option>
                            <option value="Lost"> <FaTimesCircle /> Lost</option>
                            <option value="Returned"> <FaArrowAltCircleLeft /> Returned</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Submit</button>
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default CreateUser;
