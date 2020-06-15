import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "../../services/firebase";
import "react-toastify/dist/ReactToastify.css";
import loginString from "./loginStrings";
import "./Login.css";
import { Card } from "react-bootstrap";
import {
  Avatar,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOpenOutlined";

const Login = (props) => {
  const { history, showToast } = props;
  // States

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem(loginString.ID)) {
      showToast(1, "Login Success");
      history.push("/chat");
    }
  }, [history, showToast]);

  //Handler functions
  const changeHandler = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (result) => {
        let user = result.user;
        if (user) {
          await firebase
            .firestore()
            .collection("users")
            .where("id", "==", user.uid)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const currentData = doc.data();
                localStorage.setItem(loginString.FirebaseDocumentId, doc.id);
                localStorage.setItem(loginString.ID, currentData.id);
                localStorage.setItem(loginString.Name, currentData.name);
                localStorage.setItem(loginString.Email, currentData.email);
                localStorage.setItem(
                  loginString.Password,
                  currentData.password
                );
                localStorage.setItem(loginString.PhotoURL, currentData.url);
                localStorage.setItem(
                  loginString.Description,
                  currentData.description
                );
              });
            });
        }
        history.push("/chat");
      })
      .catch((err) => {
        showToast(3, err.message);
      });
  };

  // Inline Styling
  const paper = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: "10px",
    paddingRight: "10px",
  };
  const rightComponent = {
    boxShadow: "0 80px 80px #808888",
    backgroundColor: "smokegrey",
  };
  const root = {
    height: "100vh",
    background: "linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)",
    marginBottom: "50px",
  };
  const signInSee = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "White",
    marginBottom: "20px",
    backgroundColor: "#1ebea5",
    width: "100%",
    boxShadow: "0 5px 5px #808888",
    height: "10rem",
    paddingTop: "48px",
    opacity: "0.5",
    borderBottom: "5px solid green",
  };
  const form = {
    width: "100%",
    marginTop: "50px",
  };
  const avatar = {
    backgroundColor: "green",
  };
  return (
    <Grid container component="main" style={root}>
      <CssBaseline />
      <Grid item xs={1} sm={4} md={7} className="image">
        <div className="image1"></div>
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        style={rightComponent}
        elevation={6}
        square="true"
      >
        <Card style={signInSee}>
          <div>
            <Avatar style={avatar}>
              <LockOutlinedIcon width="50px" height="50px" />
            </Avatar>
          </div>
          <div>
            <Typography component="h1" variant="h5">
              {" "}
              Sign in To
            </Typography>
          </div>
          <div>
            <Link to="/">
              <button className="btnLogin">
                <i className="fa fa-home" />
                WebChat
              </button>
            </Link>
          </div>
        </Card>
        <div style={paper}>
          <form style={form} noValidate onSubmit={submitHandler}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={changeHandler}
              value={email}
            />

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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember Me"
            />
            <div className="CenterAliningItems">
              <button className="button1" type="submit">
                <span>Login</span>
              </button>
            </div>
            <div className="CenterAliningItems">
              <p>Don't have an account?</p>
              <Link to="/signup" variant="body2">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default React.memo(Login);
