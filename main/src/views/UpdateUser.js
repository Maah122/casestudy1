import axios from "axios";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaShoppingCart, FaTimesCircle, FaArrowAltCircleLeft } from 'react-icons/fa'; // Import icons
import { useNavigate, useParams } from "react-router-dom";

function UpdateUser() {
    const { id } = useParams();

    const [name, setName] = useState('');
    const [stock, setStock] = useState('');
    const [status, setStatus] = useState('');
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/get/${id}`);
                const userData = response.data;
                console.log(userData);
                setName(userData.name);
                setStock(userData.stock._id); // Changed from userData.game to userData.stock
                setStatus(userData.status);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();

        // Fetch stocks
        axios.get('http://localhost:3001/addstock')
            .then(res => {
                setStocks(res.data); // Assuming the response is an array of stock objects
            })
            .catch(err => console.error('Error fetching stocks:', err));
    }, [id]);

    const navigate = useNavigate();

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/update/${id}`, { name, stock, status }) // Changed from game to stock
            .then(res => {
                console.log(res);
                navigate('/admin/tables');
            })
            .catch(err => console.log(err));
    };

    const handleCancel = () => {
        navigate('/admin/tables');
    };

    return (
        <div className="d-flex vh-100 bg-white justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3 shadow">
                <form onSubmit={handleUpdate}>
                    <h2 className="mb-3">Update Member</h2>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter Name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="stock" className="form-label">Game Rented</label> {/* Changed from game to stock */}
                        <select
                            id="stock"
                            className="form-control"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)} // Changed from game to stock
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
                        >
                            <option value="">Select Status</option>
                            {/* <option value="Available"> <FaCheckCircle /> Available</option> */}
                            <option value="Pending"> <FaExclamationCircle /> Pending</option>
                            <option value="Rented"> <FaShoppingCart /> Rented</option>
                            <option value="Lost"> <FaTimesCircle /> Lost</option>
                            <option value="Returned"> <FaArrowAltCircleLeft /> Returned</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Update</button>
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUser;
