var currentUser;   

//---------------------------------------------------
// Retrieve and fill our user info for your profile.
//---------------------------------------------------
function populateUserInfo() {
            firebase.auth().onAuthStateChanged(user => {
               
                if (user) {

                    
                    currentUser = db.collection("users").doc(user.uid)
                 
                    currentUser.get()
                        .then(userDoc => {
                            
                            var userName = userDoc.data().name;
                            var userDescription = userDoc.data().description;
                            var userCar = userDoc.data().car;
                            var userPhone = userDoc.data().phone;
                            var userEmail = userDoc.data().email;

                            
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


populateUserInfo();

//---------------------------------------------------
// Allows user fields to be edittable.
//---------------------------------------------------
function editUserInfo() {
  
   document.getElementById('personalInfoFields').disabled = false;
}

//-----------------------------------------------------------------------
// Saves the information in user profile and sets it to unable to change.
//-----------------------------------------------------------------------
function saveUserInfo() {
    
    userName = document.getElementById('nameInput').value;   
    userDescription = document.getElementById('descriptionInput').value;    
    userCar = document.getElementById('carInput').value; 
    userPhone = document.getElementById('phoneInput').value; 
    userEmail = document.getElementById('emailInput').value;

  
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

//---------------------------------------------------
// Shows the information on each review page.
//---------------------------------------------------
function populateReviews() {
    console.log("test");
    let rideCardTemplate = document.getElementById("reviewCardTemplate");
    let rideCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href);
    let rideID = params.searchParams.get("docID");

    
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
                var rating = doc.data().rating; 
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

               
								let starRating = "";
								
                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }
								
                for (let i = rating; i < 5; i++) {
                    starRating += '<span class="material-icons">star_outline</span>';
                }
                reviewCard.querySelector(".star-rating").innerHTML = starRating;

                rideCardGroup.appendChild(reviewCard);
            });
        });
}

populateReviews();

//---------------------------------------------------
// Saves and redirects user in review. 
//---------------------------------------------------
function saveRideDocumentIDAndRedirect(){
    let params = new URL(window.location.href) 
    let ID = params.searchParams.get("docID");
    localStorage.setItem('rideDocID', ID);
    window.location.href = 'review.html';
}