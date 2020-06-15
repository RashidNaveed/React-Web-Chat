import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css";
import { Card } from "react-bootstrap";
import firebase from "../../services/firebase";
import LoginString from "../Login/loginStrings";

import { CssBaseline, TextField, Typography } from "@material-ui/core";

const SignUp = (props) => {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // Change handlers
  const changeHandler = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "name":
        setName(value);
        break;
      default:
        break;
    }
  };

  const submitHandler = async (event) => {
    const signUpData = {
      name: name,
      email: email,
      password: password,
    };
    event.preventDefault();
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(signUpData.email, signUpData.password)
        .then(async (response) => {
          await firebase
            .firestore()
            .collection("users")
            .add({
              ...signUpData,
              id: response.user.uid,
              description: "",
              url: "",
              messages: [{ notificationId: "", number: 0 }],
            })
            .then((docRef) => {
              localStorage.setItem(LoginString.ID, response.user.uid);
              localStorage.setItem(LoginString.Name, name);
              localStorage.setItem(LoginString.Email, email);
              localStorage.setItem(LoginString.Password, password);
              localStorage.setItem(LoginString.PhotoURL, "");
              localStorage.setItem(LoginString.UPLOAD_CHANGED, "state_changed");
              localStorage.setItem(LoginString.Description, "");
              localStorage.setItem(LoginString.FirebaseDocumentId, docRef.id);
              setName("");
              setEmail("");
              setPassword("");
              props.history.push("/chat");
            })
            .catch((err) => {
              props.showToast(3, err.message);
            });
        })
        .catch((error) => {
          props.showToast(3, error.message);
        });
    } catch (error) {
      document.getElementById("1").innerHTML =
        "Error in signing up! Please try again";
    }
  };

  const signInSee = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "White",
    backgroundColor: "#1ebea5",
    width: "100%",
    boxShadow: "0 5px 5px #808888",
    height: "10rem",
    paddingTop: "48px",
    opacity: "0.5",
    borderBottom: "5px solid green",
  };
  return (
    <div>
      <CssBaseline />
      <Card style={signInSee}>
        <div>
          <Typography component="h1" variant="h5">
            Sign Up To
          </Typography>
        </div>
        <div>
          <Link to="/">
            <button className="btnSignup ">
              <i className="fa fa-home" /> WebChat
            </button>
          </Link>
        </div>
      </Card>
      <Card className="formacontrooutside">
        <form className="customform" noValidate onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address-example:abc@gmail.com"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={changeHandler}
            value={email}
          />
          <div>
            <p style={{ color: "grey", fontSize: "15px", marginLeft: "0" }}>
              Password :length should be 6
            </p>
          </div>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={changeHandler}
            value={password}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Your Name"
            name="name"
            autoComplete="name"
            onChange={changeHandler}
            value={name}
          />
          <div>
            <p style={{ color: "grey", fontSize: "15px" }}>
              Please fill all fields
            </p>
          </div>
          <div className="CenterAliningItems">
            <button className="button1" type="submit">
              <span>Sign Up</span>
            </button>
          </div>
          <div>
            <p style={{ color: "grey" }}>Already have an account?</p>
            <Link to="/login">Log In</Link>
          </div>
          <div className="error">
            <p id="1" style={{ color: "red" }}></p>
          </div>
          <div className="copyright">
            <p className="MuiTypography-root MuiTypography-body2 MuiTypography-colorTextSecondary MuiTypography-alignCenter">
              Copyright ©{" "}
              <Link color="inherit" to="">
                Rashid Naveed
              </Link>{" "}
              2020.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default React.memo(SignUp);
