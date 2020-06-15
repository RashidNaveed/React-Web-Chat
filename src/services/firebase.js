import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyACJAl6Q1AWgdDdGhb7AAvXcEPXMZOszuI",
  authDomain: "web-chat-e4216.firebaseapp.com",
  databaseURL: "https://web-chat-e4216.firebaseio.com",
  projectId: "web-chat-e4216",
  storageBucket: "web-chat-e4216.appspot.com",
  messagingSenderId: "847144583665",
  appId: "1:847144583665:web:1bf13faebb624abfd14450",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
