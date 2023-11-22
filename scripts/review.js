let params = new URL( window.location.href ); //get URL of search bar
let reviewedID = params.searchParams.get( "docID" ); //get value for key "id"
console.log("reviewID" + reviewedID);
var rideDocID = localStorage.getItem("rideDocID");    //visible to all functions on this page
function getRideName(id) {
    db.collection("rides")
      .doc(id)
      .get()
      .then((thisRide) => {
        var rideName = thisRide.data().name;
        document.getElementById("rideName").innerHTML = rideName;
          });
}
getRideName(rideDocID);
// Add this JavaScript code to make stars clickable
// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');


// // Iterate through each star element
// stars.forEach((star, index) => {
//     // Add a click event listener to the current star
//     star.addEventListener('click', () => {
//         // Fill in clicked star and stars before it
//         for (let i = 0; i <= index; i++) {
//             // Change the text content of stars to 'star' (filled)
//             document.getElementById(`star${i + 1}`).textContent = 'star';
//         }
//     });
// });

function writeReview() {
    console.log("inside write review");
    let Title = document.getElementById("title").value;
    let Experience = document.getElementById("experience").value;
    let Attitude = document.getElementById("attitude").value;
    let Description = document.getElementById("description").value;
    let Clean = document.querySelector('input[name="clean"]:checked').value;
    let Quick = document.querySelector('input[name="quick"]:checked').value;
    // Get the star rating
    const stars = document.querySelectorAll('.star');
    let Rating = 0;
    stars.forEach((star) => {
        if (star.textContent === 'star') {
            Rating++;
        }
    });
    console.log(Title, Experience, Attitude, Description, Clean, Quick, Rating);

    var user = firebase.auth().currentUser;
    if (user) {
        currentUser = db.collection("users").doc(user.uid);
        const uId = firebase.auth().currentUser.uid;
        savedUserId = uId;

        // Get the document for the current user.
        db.collection("reviews").add({
            rideDocID: rideDocID,
            reviewerID: savedUserId,
            revieweeID: reviewedID,
            title: Title,
            experience: Experience,
            attitude: Attitude,
            description: Description,
            clean: Clean,
            quick: Quick,
            rating: Rating, // Include the rating in the review
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'review.html';
    }
}
