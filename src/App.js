import React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Home from "./components/UI/Home/Home";
import SignUp from "./containers/SignUp/SignUp";
import Login from "./containers/Login/Login";
import Chat from "./containers/Chat/Chat";
import Profile from "./containers/Profile/Profile";

const App = () => {
  const showToast = (type, message) => {
    switch (type) {
      case 0:
        toast.warning(message);
        break;
      case 1:
        toast.success(message);
        break;
        case 3:
          toast.error(message);
          break;
      default:
        break;
    }
  };

  return (
    <BrowserRouter>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        position={toast.POSITION.TOP_CENTER}
      />
      <Switch>
        <Route exact path="/" render={(props) => <Home {...props} />} />
        <Route
          exact
          path="/signup"
          render={(props) => <SignUp showToast={showToast} {...props} />}
        />
        <Route
          exact
          path="/login"
          render={(props) => <Login showToast={showToast} {...props} />}
        />
        <Route
          exact
          path="/chat"
          render={(props) => <Chat showToast={showToast} {...props} />}
        />
        <Route
          exact
          path="/profile"
          render={(props) => <Profile showToast={showToast} {...props} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
