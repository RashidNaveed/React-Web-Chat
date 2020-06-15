import React, { useState, useRef, useEffect } from "react";
import "./Profile.css";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";
import firebase from "../../services/firebase";
import LoginString from "../Login/loginStrings";
import Images from "../../projectImages/projectImages";

const Profile = (props) => {
  const { history } = props;

  const refInputFile = useRef();
  // states
  const [newPhoto, setNewPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [documentKey] = useState(
    localStorage.getItem(LoginString.FirebaseDocumentId)
  );
  const [id] = useState(localStorage.getItem(LoginString.ID));
  const [name, setName] = useState(localStorage.getItem(LoginString.Name));
  const [aboutMe, setAboutMe] = useState(
    localStorage.getItem(LoginString.Description)
  );
  const [photoUrl, setPhotoUrl] = useState(
    localStorage.getItem(LoginString.PhotoURL)
  );
  useEffect(() => {
    if (!localStorage.getItem(LoginString.ID)) {
      history.push("/");
    }
  }, [history]);
  // change handlers
  const changeAvatarHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      const prefixFileType = event.target.files[0].type.toString();
      if (prefixFileType.indexOf(LoginString.PREFIX_IMAGE) !== 0) {
        props.showToast(0, "This file is not an image");
        return;
      }
      setNewPhoto(event.target.files[0]);
      setPhotoUrl(URL.createObjectURL(event.target.files[0]));
    } else {
      props.showToast(0, "Something went wrong while uploading file");
    }
  };
  const nameChangeHandler = (event) => {
    const { value } = event.target;
    setName(value);
  };
  const aboutMeChangeHandler = (event) => {
    const { value } = event.target;
    setAboutMe(value);
  };
  const uploadAvatarHandler = () => {
    setIsLoading(true);
    if (newPhoto) {
      const uploadTask = firebase.storage().ref().child(id).put(newPhoto);
      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downLoadUrl) => {
            updateUserInfo(true, downLoadUrl);
          });
        }
      );
    } else {
      updateUserInfo(false, null);
    }
  };
  const updateUserInfo = (isUpdatePhotoUrl, downLoadUrl) => {
    let newInfo;
    if (isUpdatePhotoUrl) {
      newInfo = { name: name, description: aboutMe, url: downLoadUrl };
    } else {
      newInfo = { name: name, description: aboutMe };
    }
    firebase
      .firestore()
      .collection("users")
      .doc(documentKey)
      .update(newInfo)
      .then((data) => {
        localStorage.setItem(LoginString.Name, name);
        localStorage.setItem(LoginString.Description, aboutMe);
        if (isUpdatePhotoUrl) {
          localStorage.setItem(LoginString.PhotoURL, downLoadUrl);
        }
        setIsLoading(false);
        props.showToast(1, "Update info success");
      });
  };
  return (
    <div className="profileroot">
      <div className="headerprofile">
        <span>PROFILE</span>
      </div>
      <img className="avatar" src={photoUrl} alt="" />
      <div className="viewWrapInputFile">
        <img
          className="imgInputFile"
          alt="icon gallery"
          src={Images.chooseFile}
          onClick={() => {
            refInputFile.current.click();
          }}
        />
        <input
          ref={refInputFile}
          accept="image/*"
          className="viewInputFile"
          type="file"
          onChange={changeAvatarHandler}
        />
      </div>
      <span className="textLabel">Name</span>
      <input
        className="textInput"
        value={name ? name : ""}
        placeholder="Your Name"
        onChange={nameChangeHandler}
      />
      <span className="textLabel">About Me</span>
      <input
        className="textInput"
        value={aboutMe ? aboutMe : ""}
        placeholder="Your Bio"
        onChange={aboutMeChangeHandler}
      />
      <div>
        <button className="btnUpdate" onClick={uploadAvatarHandler}>
          Save
        </button>
        <button
          className="btnback"
          onClick={() => {
            props.history.push("/chat");
          }}
        >
          Back
        </button>
      </div>
      {isLoading ? (
        <div className="viewLoading">
          <ReactLoading
            type={"spinningBubbles"}
            color={"#203152"}
            height={"8%"}
            width={"8%"}
          />
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(Profile);
