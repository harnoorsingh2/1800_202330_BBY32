let params = new URL( window.location.href );
let reviewedID = params.searchParams.get( "docID" );
console.log("reviewID" + reviewedID);
var rideDocID = localStorage.getItem("rideDocID");  

//---------------------------------------------------
// Gets the name of the person being reviewed
//---------------------------------------------------
function getDriverName(reviewedID) {
    db.collection("users")
    .doc(reviewedID)
    .get()
    .then((thisRide) => {
        var driverName = thisRide.data().name;
        console.log("ea" + thisRide.data().name);
        document.getElementById("rideName").innerHTML = "Review for " + driverName;
    });
}
getDriverName(rideDocID);

// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');
stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        console.log("clicked star");
        for (let i = 0; i <= index; i++) {
            document.getElementById(`star${i + 1}`).textContent = 'star';
        }

        if (index < 4) {
            for (let i = index; i <= 4; i++) {
            document.getElementById(`star${i + 2}`).textContent = 'star_outline';
        }
        }
    });
});

//---------------------------------------------------
// Saves review to the database
//---------------------------------------------------
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
    //console.log(Title, Experience, Attitude, Description, Clean, Quick, Rating);

    var user = firebase.auth().currentUser;
    if (user) {
        currentUser = db.collection("users").doc(user.uid);
        const uId = firebase.auth().currentUser.uid;
        savedUserId = uId;

        // saves to reviews collection
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
            rating: Rating,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "./thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = './review.html';
    }
}
