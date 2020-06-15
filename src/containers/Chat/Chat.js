import React, { useState, useEffect } from "react";
import loginString from "../Login/loginStrings";
import firebase from "../../services/firebase";
import "./Chat.css";
import ReactLoading from "react-loading";
import UserWelcome from "../../components/UI/UserWelcome/UserWelcome";
import ChatBox1 from "./ChatBox/ChatBox";

const Chat = (props) => {
  const { history } = props;
  useEffect(() => {}, []);
  let currentUserName = localStorage.getItem(loginString.Name);
  let currentUserId = localStorage.getItem(loginString.ID);
  let currentUserPhoto = localStorage.getItem(loginString.PhotoURL);
  let currentUserDocumentId = localStorage.getItem(
    loginString.FirebaseDocumentId
  );
  let currentUserMessages = [];
  let searchUsers = [];
  let notificationMessagesErase = [];

  //states
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDialogConfrimLogout, setIsOpenDialogConfrimLogout] = useState(
    false
  );
  const [currentPeerUser, setCurrentPeerUser] = useState(null);
  const [displayedContacts, setDisplayedContacts] = useState([]);

  const getClassNameforUserAndNotification = (itemId) => {
    let className = "";
    let check = false;
    if (currentPeerUser && currentPeerUser.id === itemId) {
      className = "viewWrapItemFocused";
    } else {
      currentUserMessages.forEach((item) => {
        if (item.notificationId.length > 0) {
          if (item.notificationId === itemId) {
            check = true;
          }
        }
      });
      if (check === true) {
        className = "viewWrapItemNotification";
      } else {
        className = "viewWrapItem";
      }
    }
    return { className: className };
  };
  const updateRenderList = () => {
    firebase.firestore().collection("users").doc(currentUserDocumentId).update({
      messages: notificationMessagesErase,
    });
  };
  const notificationErase = (itemId) => {
    currentUserMessages.forEach((el) => {
      if (el.notificationId.length > 0) {
        if (el.notificationId !== itemId) {
          notificationMessagesErase.push({
            notificationId: el.notificationId,
          });
        }
      }
    });
    updateRenderList();
  };

  const renderListUser = () => {
    if (searchUsers.length > 0) {
      let viewListUser = [];
      let values;
      let badge = <i className="fa fa-envelope-o" aria-hidden="true"></i>;
      searchUsers.map((item) => {
        if (item.id !== currentUserId) {
          values = getClassNameforUserAndNotification(item.id);
          return viewListUser.push(
            <button
              key={item.id}
              id={item.key}
              className={values.className}
              onClick={() => {
                notificationErase(item.id);
                setCurrentPeerUser(item);
                document.getElementById(item.key).style.backgroundColor =
                  "#fff";
                document.getElementById(item.key).style.color = "#fff";
                badge = null;
              }}
            >
              <img className="viewAvatarItem" src={item.url} alt="" />
              <div className="viewWrapContentItem">
                <span className="textItem">{`Name : ${item.name}`}</span>
              </div>
              {values.className === "viewWrapItemNotification" ? (
                <span style={{ marginRight: "4%", marginTop: "1%" }}>
                  {badge}
                </span>
              ) : null}
            </button>
          );
        } else {
          return null;
        }
      });
      setDisplayedContacts(viewListUser);
    } else {
      props.showToast(0, "no user loaded");
    }
  };
  const getUsersList = async () => {
    const result = await firebase.firestore().collection("users").get();
    if (result.docs.length > 0) {
      let usersList = [];
      usersList = [...result.docs];
      usersList.forEach((item, index) => {
        searchUsers.push({
          key: index,
          doucmentKey: item.id,
          id: item.data().id,
          name: item.data().name,
          messages: item.data().messages,
          url: item.data().url,
          description: item.data().description,
        });
      });
      setIsLoading(false);
    }
    setSearchedUsers(searchUsers);
    renderListUser();
  };
  useEffect(() => {
    if (!currentUserId) {
      history.push("/");
    }
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserDocumentId)
      .get()
      .then((doc) => {
        doc.data().messages.map((message) => {
          return currentUserMessages.push({
            notificationId: message.notificationId,
            number: message.number,
          });
        });
      });
    getUsersList();
  }, []);

  // Handler functions

  const userProfileHandler = () => {
    props.history.push("/profile");
  };
  const onLogoutClick = () => {
    setIsOpenDialogConfrimLogout(true);
  };
  const logoutHandler = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setIsLoading(false);
        localStorage.clear();
        props.showToast(1, "Logout success");
        props.history.push("/");
      })
      .catch((err) => {
        setIsLoading(false);
        props.showToast(2, err.message);
      });
  };
  const hideDialogConfirmLogout = () => {
    setIsOpenDialogConfrimLogout(false);
  };
  const searchHandler = (event) => {
    let searchQuery = event.target.value.toLowerCase();
    let displayedContact;
    displayedContact = searchedUsers.filter((el) => {
      if (el.id !== currentUserId) {
        let searchValue = el.name.toLowerCase();
        return searchValue.indexOf(searchQuery) !== -1;
      } else {
        return null;
      }
    });

    displaySearchedContacts(displayedContact);
  };
  const displaySearchedContacts = (displayedContact) => {
    if (displayedContact.length > 0) {
      let viewListUser = [];
      let values;
      let badge = <i className="fa fa-envelope-o" aria-hidden="true"></i>;
      displayedContact.map((item) => {
        if (item.id !== currentUserId) {
          values = getClassNameforUserAndNotification(item.id);
          return viewListUser.push(
            <button
              key={item.key}
              id={item.key}
              className={values.className}
              onClick={() => {
                notificationErase(item.id);
                setCurrentPeerUser(item);
                document.getElementById(item.key).style.backgroundColor =
                  "#fff";
                document.getElementById(item.key).style.color = "#fff";
                badge = null;
              }}
            >
              <img className="viewAvatarItem" src={item.url} alt="" />
              <div className="viewWrapContentItem">
                <span className="textItem">{`Name : ${item.name}`}</span>
              </div>
              {values.className === "viewWrapItemNotification" ? (
                <span style={{ marginRight: "4%", marginTop: "1%" }}>
                  {badge}
                </span>
              ) : null}
            </button>
          );
        } else {
          return null;
        }
      });
      setDisplayedContacts(viewListUser);
    } else {
      props.showToast(0, "no user present");
    }
  };
  const welcome = () => {
    setCurrentPeerUser(false);
  };
  const renderDialogConfirmLogout = () => {
    return (
      <div>
        <div className="viewWrapTextDialogConfirmLogout">
          <span className="titleDialogConfirmLogout">
            Are you sure to logout?
          </span>
        </div>
        <div className="viewWrapButtonDialogConfirmLogout">
          <button className="btnYes" onClick={logoutHandler}>
            YES
          </button>
          <button className="btnNo" onClick={hideDialogConfirmLogout}>
            CANCEL
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="root">
      <div className="body">
        <div className="viewListUser">
          <div className="profileviewleftside" onClick={welcome}>
            <img
              className="ProfilePicture"
              alt=""
              src={currentUserPhoto}
              onClick={userProfileHandler}
            />

            <button className="Logout" onClick={onLogoutClick}>
              Logout
            </button>

            <h6
              style={{
                fontWeight: "bold",
                marginTop: "3%",
              }}
            >
              {currentUserName}
            </h6>
          </div>
          <div className="rootsearchbar">
            <div className="input-container">
              <i className="fa fa-search icon" />
              <input
                className="input-field"
                type="text"
                placeholder="Search"
                onChange={searchHandler}
              />
            </div>
          </div>
          {displayedContacts}
        </div>
        <div className="viewBoard">
          {currentPeerUser ? (
            <ChatBox1
              currentPeerUser={currentPeerUser}
              showToast={props.showToast}
            />
          ) : (
            <UserWelcome
              currentUserPhoto={currentUserPhoto}
              currentUserName={currentUserName}
            />
          )}
        </div>
      </div>
      {/* Dialog confirm */}
      {isOpenDialogConfrimLogout ? (
        <div className="viewCoverScreen">{renderDialogConfirmLogout()}</div>
      ) : null}

      {/* Loading */}
      {isLoading ? (
        <div className="viewLoading">
          <ReactLoading
            type={"spin"}
            color={"#203152"}
            height={"3%"}
            width={"3%"}
          />
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(Chat);
