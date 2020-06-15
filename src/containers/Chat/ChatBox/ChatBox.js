import React, { Component } from "react";
import moment from "moment";
import ReactLoading from "react-loading";
import "react-toastify/dist/ReactToastify.css";
import "./ChatBox.css";
import loginString from "../../Login/loginStrings";
import firebase from "../../../services/firebase";
import Images, { Stickers } from "../../../projectImages/projectImages";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const stickers = [];
for (let img in Stickers) {
  stickers.push({
    id: img,
    image: Stickers[img],
  });
}
export default class ChatBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowSticker: false,
      inputValue: "",
    };
    this.currentUserId = localStorage.getItem(loginString.ID);
    // this.currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
    // this.currentUserNickname = localStorage.getItem(AppString.NICKNAME)
    this.listMessage = [];
    this.currentPeerUser = this.props.currentPeerUser;
    this.groupChatId = null;
    this.removeListener = null;
    this.currentPhotoFile = null;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    // For first render, it's not go through componentWillReceiveProps
    this.getListHistory();
  }

  componentWillUnmount() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentPeerUser) {
      this.currentPeerUser = newProps.currentPeerUser;
      this.getListHistory();
    }
  }

  getListHistory = () => {
    if (this.removeListener) {
      this.removeListener();
    }
    this.listMessage.length = 0;
    this.setState({ isLoading: true });
    if (
      this.hashString(this.currentUserId) <=
      this.hashString(this.currentPeerUser.id)
    ) {
      this.groupChatId = `${this.currentUserId}-${this.currentPeerUser.id}`;
    } else {
      this.groupChatId = `${this.currentPeerUser.id}-${this.currentUserId}`;
    }

    // Get history and listen new data added
    this.removeListener = firebase
      .firestore()
      .collection("Messages")
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === loginString.DOC) {
              this.listMessage.push(change.doc.data());
            }
          });
          this.setState({ isLoading: false });
        },
        (err) => {
          this.props.showToast(2, err.toString());
        }
      );
  };

  openListSticker = () => {
    this.setState({ isShowSticker: !this.state.isShowSticker });
  };

  onSendMessage = (content, type) => {
    if (this.state.isShowSticker && type === 2) {
      this.setState({ isShowSticker: false });
    }

    if (content.trim() === "") {
      return;
    }

    const timestamp = moment().valueOf().toString();
    const itemMessage = {
      idFrom: this.currentUserId,
      idTo: this.currentPeerUser.id,
      timestamp: timestamp,
      content: content.trim(),
      type: type,
    };
    firebase
      .firestore()
      .collection("Messages")
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .doc(timestamp)
      .set(itemMessage)
      .then(() => {
        this.setState({ inputValue: "" });
        firebase
          .firestore()
          .collection("users")
          .doc(this.currentPeerUser.doucmentKey)
          .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
              notificationId: this.currentUserId,
            }),
          });
      })
      .catch((err) => {
        this.props.showToast(2, err.toString());
      });
  };

  onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ isLoading: true });
      this.currentPhotoFile = event.target.files[0];
      // Check this file is an image?
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf(loginString.PREFIX_IMAGE) === 0) {
        this.uploadPhoto();
      } else {
        this.setState({ isLoading: false });
        this.props.showToast(0, "This file is not an image");
      }
    } else {
      this.setState({ isLoading: false });
    }
  };

  uploadPhoto = () => {
    if (this.currentPhotoFile) {
      const timestamp = moment().valueOf().toString();
      const uploadTask = firebase
        .storage()
        .ref()
        .child(timestamp)
        .put(this.currentPhotoFile);

      uploadTask.on(
        loginString.UPLOAD_CHANGED,
        null,
        (err) => {
          this.setState({ isLoading: false });
          this.props.showToast(2, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.setState({ isLoading: false });
            this.onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      this.setState({ isLoading: false });
      this.props.showToast(0, "File is null");
    }
  };

  onKeyboardPress = (event) => {
    if (event.key === "Enter") {
      this.onSendMessage(this.state.inputValue, 0);
    }
  };

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({});
    }
  };

  render() {
    return (
      <Card className="viewChatBoard">
        <div className="headerChatBoard">
          <img
            className="viewAvatarItem"
            alt=""
            src={this.currentPeerUser.url}
          />
          <span className="textHeaderChatBoard">
            <p style={{ fontSize: "20px" }}>{this.currentPeerUser.name}</p>
          </span>
          <div className="aboutme">
            <span className="textHeaderChatBoard">
              <p>{this.currentPeerUser.description}</p>
            </span>
          </div>
        </div>

        {/* List message */}
        <div className="viewListContentChat">
          {this.renderListMessage()}
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          />
        </div>

        {/* Stickers */}
        {this.state.isShowSticker ? this.renderStickers() : null}

        {/* View bottom */}
        <div className="viewBottom">
          <img
            className="icOpenGallery"
            src={Images.ic_photo}
            alt="icon open gallery"
            onClick={() => this.refInput.click()}
          />
          <input
            className="viewInputGallery"
            ref={(el) => {
              this.refInput = el;
            }}
            accept="image/*"
            type="file"
            onChange={this.onChoosePhoto}
          />

          <img
            className="icOpenSticker"
            src={Images.ic_stickers}
            alt="icon open stickers"
            onClick={this.openListSticker}
          />

          <input
            className="viewInput"
            placeholder="Type your message..."
            value={this.state.inputValue}
            onChange={(event) => {
              this.setState({ inputValue: event.target.value });
            }}
            onKeyPress={this.onKeyboardPress}
          />
          <img
            className="icSend"
            src={Images.ic_send}
            alt="icon send"
            onClick={() => this.onSendMessage(this.state.inputValue, 0)}
          />
        </div>

        {/* Loading */}
        {this.state.isLoading ? (
          <div className="viewLoading">
            <ReactLoading
              type={"spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            />
          </div>
        ) : null}
      </Card>
    );
  }

  renderListMessage = () => {
    if (this.listMessage.length > 0) {
      let viewListMessage = [];
      this.listMessage.forEach((item, index) => {
        if (item.idFrom === this.currentUserId) {
          // Item right (my message)
          if (item.type === 0) {
            viewListMessage.push(
              <React.Fragment key={item.timestamp}>
                <div className="viewItemRight">
                  <span className="textContentItem">{item.content}</span>
                  <span className="message">
                    <span className="messageTime">
                      {moment(Number(item.timestamp)).format(" h:mm a")}
                    </span>
                  </span>
                </div>
              </React.Fragment>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewItemRight2" key={item.timestamp}>
                <img
                  className="imgItemRight"
                  src={item.content}
                  alt="Please send your pic again"
                />
                <span className="message">
                  <span className="messageTime">
                    {moment(Number(item.timestamp)).format(" h:mm a")}
                  </span>
                </span>
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewItemRight3" key={item.timestamp}>
                <img
                  className="imgItemRight"
                  src={this.getGifImage(item.content)}
                  alt="Please send your gif again"
                />
                <span className="message">
                  <span className="messageTime">
                    {moment(Number(item.timestamp)).format(" h:mm a")}
                  </span>
                </span>
              </div>
            );
          }
        } else {
          // Item left (peer message)
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewWrapItemLeft" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.currentPeerUser.url}
                      alt="avatar"
                      className="peerAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft">
                    <span className="textContentItem">{item.content}</span>
                    <span className="message">
                      <span className="messageTime">
                        {moment(Number(item.timestamp)).format(" h:mm a")}
                      </span>
                    </span>
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="time">
                    {moment(Number(item.timestamp)).format("ll")}
                  </span>
                ) : null}
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.currentPeerUser.url}
                      alt="avatar"
                      className="peerAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft2">
                    <img
                      className="imgItemLeft"
                      src={item.content}
                      alt="content message"
                    />
                    <span className="message">
                      <span className="messageTime">
                        {moment(Number(item.timestamp)).format(" h:mm a")}
                      </span>
                    </span>
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="time">
                    {moment(Number(item.timestamp)).format("ll")}
                  </span>
                ) : null}
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.currentPeerUser.url}
                      alt="avatar"
                      className="peerAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )}
                  <div className="viewItemLeft3" key={item.timestamp}>
                    <img
                      className="imgItemLeft"
                      src={this.getGifImage(item.content)}
                      alt="content message"
                    />
                    <span className="message">
                      <span className="messageTime">
                        {moment(Number(item.timestamp)).format(" h:mm a")}
                      </span>
                    </span>
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="time">
                    {moment(Number(item.timestamp)).format("ll")}
                  </span>
                ) : null}
              </div>
            );
          }
        }
      });
      return viewListMessage;
    } else {
      return (
        <div className="viewWrapSayHi">
          <span className="textSayHi">Say hi to new friend</span>
          <img className="imgWaveHand" src={Images.wave_hand} alt="wave hand" />
        </div>
      );
    }
  };

  renderStickers = () => {
    return (
      <div className="viewStickers">
        {stickers.map((sticker) => (
          <img
            key={sticker.id}
            className="imgSticker"
            src={sticker.image}
            alt="stickers"
            onClick={() => {
              this.onSendMessage(sticker.id.toString(), 2);
            }}
          />
        ))}
        ;
      </div>
    );
  };

  hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  getGifImage = (value) => {
    return Stickers[value] || null;
  };

  isLastMessageLeft(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom === this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  isLastMessageRight(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom !== this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }
}
