import firebase from "firebase";
export const config = {
  apiKey: "AIzaSyBSzKEFs1vbvLST5qWwEwywO2dES_IurYI",
  authDomain: "abandoned-cars-tracker.firebaseapp.com",
  databaseURL: "https://abandoned-cars-tracker.firebaseio.com",
  projectId: "abandoned-cars-tracker",
  storageBucket: "abandoned-cars-tracker.appspot.com",
  messagingSenderId: "443760195441"
};
firebase.initializeApp(config);

export default firebase;
