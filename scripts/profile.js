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
                            if (user != null) {
                                document.getElementById("phoneInput").value = userPhone
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
    userPhone = documetn.getElementById('phoneInput').value;      

    //b) update user's document in Firestore
    currentUser.update({
                    name: userName,
                    description: userDescription,
                    car: userCar,
                    phone: userPhone
                })
                .then(() => {
                    console.log("Document successfully updated!");
                })
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}