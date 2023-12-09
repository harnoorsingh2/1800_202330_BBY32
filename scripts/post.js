var currentUser; 
var userName;
var userPhone;
var userEmail;

firebase.auth().onAuthStateChanged(user => {
    
    if (user) {
        currentUser = db.collection("users").doc(user.uid)

        currentUser.get()
        .then(userDoc => {
            
            userName = userDoc.data().name;
            userPhone = userDoc.data().phone;
            userEmail = userDoc.data().email;

            const userId = firebase.auth().currentUser.uid;
            savedUserId = userId;
            console.log(savedUserId);

            
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
    } else {
    
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
})

//---------------------------------------------------
// Saves the post information into the firebase.
//---------------------------------------------------
function savePostInfo() {
    
    rideDate = document.getElementById('monthInput').value + " " + document.getElementById('dayInput').value;
    rideTime = document.getElementById('hourInput').value + ":" + document.getElementById('minuteInput').value + document.getElementById('amOrPm').value;
    ridePrice = "$" + document.getElementById('ridePrice').value;
    posterCar = document.getElementById('posterVehicle').value; 
    seats = document.getElementById('seats').value;
    fromLocation = document.getElementById('fromCity').value + " " + document.getElementById('fromStreet').value
    toLocation = document.getElementById('toCity').value + " " + document.getElementById('toStreet').value
    pickUp = document.getElementById('pickUp').value

       
        db.collection("posts").add({
            posterUID: savedUserId,
            posterName: userName,
            date: rideDate,
            time: rideTime,
            price: ridePrice,
            car: posterCar,
            carSeats: seats,
            from: fromLocation,
            to: toLocation,
            pickup: pickUp
        }).then(() => {
            window.location.href = "thanks.html";
        });
}
