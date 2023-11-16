var currentUser; 
var userName;
var userPhone;
var userEmail;

firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
        currentUser = db.collection("users").doc(user.uid)

        currentUser.get()
        .then(userDoc => {
            //get the data fields of the user
            //remove/users/ from thing
            userName = userDoc.data().name;
            userPhone = userDoc.data().phone;
            userEmail = userDoc.data().email;

        const userId = firebase.auth().currentUser.uid;
         savedUserId = userId;

            //if the data fields are not empty, then write them in to the form.
            if (posterCar == null) {
                posterCar = userDoc.data().car;
            }
            if (userName != null) {
                //
            }
            if (userPhone != null) {
                //
            }
            if (userEmail != null) {
                //
            }
            if (savedUserId != null) {
            //
            }
        })
    }
})

function savePostInfo() {
    //a) get user entered values   
    rideDate = document.getElementById('monthInput').value + " " + document.getElementById('dayInput').value;
    rideTime = document.getElementById('hourInput').value + ":" + document.getElementById('minuteInput').value + document.getElementById('amOrPm').value;
    ridePrice = "$" + document.getElementById('ridePrice').value;
    posterCar = document.getElementById('posterVehicle').value; 
    seats = document.getElementById('seats').value;
    fromLocation = document.getElementById('fromCity').value + " " + document.getElementById('fromStreet').value
    toLocation = document.getElementById('toCity').value + " " + document.getElementById('toStreet').value
    

        // Get the document for the current user.
        db.collection("posts").add({
            posterUID: savedUserId,
            posterName: userName,
            date: rideDate,
            time: rideTime,
            price: ridePrice,
            car: posterCar,
            carSeats: seats,
            from: fromLocation,
            to: toLocation
        }).then(() => {
            window.location.href = "submitted.html"; // Redirect
        });
}
