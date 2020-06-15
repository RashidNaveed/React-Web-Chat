import React from "react";
import "./UserWelcome.css";
import "react-toastify/dist/ReactToastify.css";

const UserWelcome = (props) => {
  return (
    <div className="viewWelcomeBoard">
      <img className="avatarWelcome" alt="" src={props.currentUserPhoto} />
      <span className="textTitleWelcome">{`Welcome ${props.currentUserName}`}</span>
      <span className="textDesciptionWelcome">Let's connect the World</span>
    </div>
  );
};

export default UserWelcome;
