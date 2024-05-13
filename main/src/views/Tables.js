import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import axios from "axios";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaShoppingCart,
  FaTimesCircle,
  FaArrowAltCircleLeft,
} from "react-icons/fa"; // Import icons

function Tables() {
  const [members, setMembers] = useState([]);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleModal = (id) => {
    setDeleteMemberId(id);
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/");
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/deleteuser/${deleteMemberId}`);
      setModalOpen(false); // Close the modal after deletion
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return <FaCheckCircle style={{ color: "green" }} />;
      case "Pending":
        return <FaExclamationCircle style={{ color: "orange" }} />;
      case "Rented":
        return <FaShoppingCart style={{ color: "blue" }} />;
      case "Lost":
        return <FaTimesCircle style={{ color: "red" }} />;
      case "Returned":
        return <FaArrowAltCircleLeft style={{ color: "purple" }} />;
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US");
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col xs="8">
                    <CardTitle tag="h4">Game Rented Table </CardTitle>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Link to="/create" className="btn btn-success btn-sm mb-3">
                      {" "}
                      Add member
                    </Link>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row className="mb-3">
                  <Col xs="6">
                    <Input
                      type="text"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                </Row>
                <Table>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Game Rented</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.stock ? user.stock.title : ""}</td>
                        <td>
                          {user.stock ? (
                            <img
                              src={`http://localhost:3001/${user.stock.imagePath}`}
                              alt={user.stock.title} // Provide an alt text for accessibility
                              style={{ maxWidth: "100px", maxHeight: "100px" }} // Optional: Set max width and height
                            />
                          ) : (
                            ""
                          )}
                        </td>
                        <td
                          style={{
                            color:
                              user.status === "Available"
                                ? "green"
                                : user.status === "Pending"
                                ? "orange"
                                : user.status === "Rented"
                                ? "blue"
                                : user.status === "Lost"
                                ? "red"
                                : user.status === "Returned"
                                ? "purple"
                                : "black",
                          }}
                        >
                          {getStatusIcon(user.status)} {user.status}
                        </td>
                        <td>{formatDate(user.date)}</td>
                        <td>
                          <Link
                            to={`/edit/${user._id}`}
                            className="btn btn-primary btn-sm me-2"
                          >
                            Update
                          </Link>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => toggleModal(user._id)}
                          >
                            Delete
                          </Button>
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
        <ModalBody>Are you sure you want to delete this member?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Yes
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Tables;
