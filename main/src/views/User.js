import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AsyncStorage from "@react-native-async-storage/async-storage";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function User() {
  const [user, setUser] = useState({
    _id: "",
    username: "",
    name: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    zipcode: "",
    email: "",
    password: "",
    admin: true,
    aboutme: "",
    imagePath: "",
  });
  const [image, setImage] = useState("");

  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      try {
        const formData = new FormData();
        formData.append('file', file); // Assuming 'file' is the variable holding the selected file
        formData.append('_id', user._id); // Pass the user's _id along with the image
      
        const response = axios.post("http://localhost:3001/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

      } catch (error) {
        console.error("Error uploading image:", error);
      }
      

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e) => {
    console.log(user);
    if (!user._id) {
      console.error("Invalid ID");
      return;
    }
    user.imagePath = image;
    axios
      .put(`http://localhost:3001/user/update/${user._id}`, user)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const getUserData = async () => {
    try {
      const email = await AsyncStorage.getItem("email");

      if (email) {
        const response = await axios.get(`http://localhost:3001/user/${email}`);
        if (response.data) {
          const newUser = {
            _id: response.data._id,
            username: response.data.username,
            name: response.data.name,
            lastName: response.data.lastname,
            address: response.data.address,
            city: response.data.city,
            country: response.data.country,
            zipcode: response.data.zipcode,
            email: response.data.email,
            password: response.data.password,
            admin: response.data.admin,
            aboutme: response.data.aboutme,
            imagePath: response.data.imagePath,
          };

          setUser(newUser);
          console.log(newUser);
        }
      } else {
        console.error("Email not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error getting email from AsyncStorage:", error);
    }
  };


  useEffect(() => {
    getUserData(); // Call the function when the component mounts
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col md="4">
            <Card className="card-user">
              <div className="image">
                <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              <CardBody>
                <div className="author">
                  <a
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      inputRef.current.click();
                    }}
                  >
                    {image ? (
                      <img
                        alt="User Avatar"
                        className="avatar border-gray"
                        src={image}
                      />
                    ) : user.imagePath ? (
                      <img
                        alt="User Avatar"
                        className="avatar border-gray"
                        src={`http://localhost:3001/${user.imagePath}`}
                      />
                    ) : (
                      <img
                        alt="Default Avatar"
                        className="avatar border-gray"
                        src={require("assets/img/default-avatar.png")}
                      />
                    )}
                    <h5 className="title">{user.name}</h5>
                  </a>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={inputRef}
                    onChange={handleImageChange}
                  />
                  <p className="description">@{user.username}</p>
                </div>
                <p className="description text-center">
                  "
                  {user.aboutme.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}"
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="button-container">
                  <Row>

                  </Row>
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-user">
              <CardHeader>
                <CardTitle tag="h5">Edit Profile</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Username</label>
                        <Input
                          defaultValue={user.username}
                          placeholder="Username"
                          type="text"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setUser((prevUser) => ({
                              ...prevUser,
                              username: e.target.value,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Input
                          defaultValue={user.email}
                          placeholder="Email"
                          type="email"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setUser((prevUser) => ({
                              ...prevUser,
                              email: e.target.value,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          defaultValue={user.name}
                          placeholder="Company"
                          type="text"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setUser((prevUser) => ({
                              ...prevUser,
                              name: e.target.value,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          defaultValue={user.lastName}
                          placeholder="Last Name"
                          type="text"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setUser((prevUser) => ({
                              ...prevUser,
                              lastName: e.target.value,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          defaultValue={user.address}
                          placeholder="Home Address"
                          type="text"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setUser((prevUser) => ({
                              ...prevUser,
                              address: e.target.value,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <FormGroup>
                        <label>City</label>
                        <Input
                          defaultValue={user.city}
                          placeholder="City"
                          type="text"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setUser((prevUser) => ({
                              ...prevUser,
                              city: e.target.value,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-1" md="4">
                      <FormGroup>
                        <label>Country</label>
                        <Input
                          defaultValue={user.country}
                          placeholder="Country"
                          type="text"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setUser((prevUser) => ({
                              ...prevUser,
                              country: e.target.value,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup>
                        <label>Postal Code</label>
                        <Input
                          defaultValue={user.zipcode}
                          placeholder="ZIP Code"
                          type="number"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setUser((prevUser) => ({
                              ...prevUser,
                              zipcode: e.target.value,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          type="textarea"
                          defaultValue={user.aboutme}
                          onChange={(e) => {
                            console.log(e.target.value);
                            setUser((prevUser) => ({
                              ...prevUser,
                              aboutme: e.target.value,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <div className="update ml-auto mr-auto">
                      <Button
                        className="btn-round"
                        color="primary"
                        onClick={handleUpdate}
                      >
                        Update Profile
                      </Button>
                    </div>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
