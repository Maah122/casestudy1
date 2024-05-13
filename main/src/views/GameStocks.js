import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

function Tables() {
  const [stocks, setStocks] = useState([]);
  const [deleteStockId, setDeleteStockId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/addstock");
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const toggleModal = (id) => {
    setDeleteStockId(id);
    setModalOpen(!modalOpen);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/deleteStock/${deleteStockId}`);
      setModalOpen(false); // Close the modal after deletion
      fetchStocks();
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col xs="8">
                    <CardTitle tag="h4">Available Games</CardTitle>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Link to="/addstock" className="btn btn-success btn-sm mb-3">
                      Add Game
                    </Link>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead className="text-primary">
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Genre</th>
                      <th>Available</th>
                      <th>Rating</th>
                      <th>Price</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <tr key={stock._id}>
                        <td>
                          <img
                            src={`http://localhost:3001/${stock.imagePath}`}
                            alt={stock.title}
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        </td>
                        <td>{stock.title}</td>
                        <td>{stock.genre}</td>
                        <td>{stock.available}</td>
                        <td>{stock.rating}</td>
                        <td>₱{stock.price}</td> {/* Changed to peso symbol */}
                        <td className="text-end">
                          <Link to={`/updatestock/${stock._id}`} className="btn btn-primary btn-sm me-2">
                            Update
                          </Link>
                          <button onClick={() => toggleModal(stock._id)} className="btn btn-danger btn-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      {/* Modal for confirmation */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this stock?</ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={handleDelete}>
            Yes
          </button>
          <button className="btn btn-secondary" onClick={toggleModal}>
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Tables;
