import * as firebase from "firebase";

export class FBC {
  static instance: FBC;
  static init() {
    FBC.instance = new FBC();
  }

  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyA3jHAWm_dqzKi4kRaPq9y774Zo0jghoxU",
      authDomain: "the-button-6e8ed.firebaseapp.com",
      // databaseURL: "https://the-button-6e8ed.firebaseio.com",
      projectId: "the-button-6e8ed"
      // storageBucket: "the-button-6e8ed.appspot.com",
      // messagingSenderId: "222120011064"
    });

    // var db = firebase.firestore();
    // db.collection("rooms").get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => ${doc.data()}`);
    //   });
    // });
  }
}
