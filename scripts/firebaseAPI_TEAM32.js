//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyAFfvlrnjXwD6Z5L4DiFwRGrAcIWj2gAs4",
    authDomain: "comp1800-202330-bby32.firebaseapp.com",
    projectId: "comp1800-202330-bby32",
    storageBucket: "comp1800-202330-bby32.appspot.com",
    messagingSenderId: "277288091355",
    appId: "1:277288091355:web:f45166644f04358d5d96fe"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();