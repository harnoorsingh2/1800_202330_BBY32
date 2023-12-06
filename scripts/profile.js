var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
            firebase.auth().onAuthStateChanged(user => {
                // Check if user is signed in:
                if (user) {

                    //go to the correct user document by referencing to the user uid
                    currentUser = db.collection("users").doc(user.uid)
                    //get the document for current user.
                    currentUser.get()
                        .then(userDoc => {
                            //get the data fields of the user
                            var userName = userDoc.data().name;
                            var userDescription = userDoc.data().description;
                            var userCar = userDoc.data().car;
                            var userPhone = userDoc.data().phone;
                            var userEmail = userDoc.data().email;

                            //if the data fields are not empty, then write them in to the form.
                            if (userName != null) {
                                document.getElementById("nameInput").value = userName;
                            }
                            if (userDescription != null) {
                                document.getElementById("descriptionInput").value = userDescription;
                            }
                            if (userCar != null) {
                                document.getElementById("carInput").value = userCar;
                            }
                            if (userPhone != null) {
                                document.getElementById("phoneInput").value = userPhone;
                            }
                            if (userEmail != null) {
                                document.getElementById("emailInput").value = userEmail;
                            }

                        })
                } else {
                    
                    window.location.href = "login.html";
                    console.log ("No user is signed in");
                }
            });
        }

//call the function to run it 
populateUserInfo();

function editUserInfo() {
   //Enable the form fields
   document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
     //enter code here

    //a) get user entered values
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userDescription = document.getElementById('descriptionInput').value;    
    userCar = document.getElementById('carInput').value; 
    userPhone = document.getElementById('phoneInput').value; 
    userEmail = document.getElementById('emailInput').value;

    //b) update user's document in Firestore
    currentUser.update({
                    name: userName,
                    description: userDescription,
                    car: userCar,
                    phone: userPhone,
                    email: userEmail
                })
                .then(() => {
                    console.log("Document successfully updated!");
                })
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}


function populateReviews() {
    console.log("test");
    let rideCardTemplate = document.getElementById("reviewCardTemplate");
    let rideCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let rideID = params.searchParams.get("docID");

    // Double-check: is your collection called "Reviews" or "reviews"?
    db.collection("reviews")
        .where("rideDocID", "==", rideID)
        .get()
        .then((allReviews) => {
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach((doc) => {
                var title = doc.data().title;
                var experience = doc.data().experience;
                var attitude = doc.data().attitude;
                var description = doc.data().description;
                var clean = doc.data().clean;
                var quick = doc.data().quick;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating; // Get the rating value
                console.log(rating)

                console.log(time);

                let reviewCard = rideCardTemplate.content.cloneNode(true);
                reviewCard.querySelector(".title").innerHTML = title;
                reviewCard.querySelector(".time").innerHTML = new Date(
                    time
                ).toLocaleString();
                reviewCard.querySelector(".experience").innerHTML = `Experience: ${experience}`;
                reviewCard.querySelector(".attitude").innerHTML = `Attitude: ${attitude}`;
                reviewCard.querySelector(".clean").innerHTML = `Clean: ${clean}`;
                reviewCard.querySelector(".quick").innerHTML = `Quick: ${quick}`;
                reviewCard.querySelector( ".description").innerHTML = `Description: ${description}`;

                // Populate the star rating based on the rating value
                
	              // Initialize an empty string to store the star rating HTML
								let starRating = "";
								// This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }
								// After the first loop, this second loop runs from i=rating to i<5.
                for (let i = rating; i < 5; i++) {
                    starRating += '<span class="material-icons">star_outline</span>';
                }
                reviewCard.querySelector(".star-rating").innerHTML = starRating;

                rideCardGroup.appendChild(reviewCard);
            });
        });
}

populateReviews();

function saveRideDocumentIDAndRedirect(){
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('rideDocID', ID);
    window.location.href = 'review.html';
}
