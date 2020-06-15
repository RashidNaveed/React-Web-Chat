import * as firebase from "firebase";

var firebaseConfig = {
 // add your firebase configuration here
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
  projectId: '### CLOUD FIRESTORE PROJECT ID ###'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
