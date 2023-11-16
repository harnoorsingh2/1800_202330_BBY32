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
                    // No user is signed in.
                    console.log ("No user is signed in");
                }
            });
        }

//call the function to run it 
populateUserInfo();