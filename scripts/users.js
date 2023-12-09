var currentUser;        

//------------------------------------------------------------------------------
// Gets all the info of the user being viewed and inputs it to the page
//------------------------------------------------------------------------------
function populateUserInfo() {
    let params = new URL( window.location.href );
    let ID = params.searchParams.get( "docID" ); 

    currentUser = db.collection("users").doc(ID)

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
        document.getElementById("rev").href = "./review.html?docID=" + ID;

    })
}
populateUserInfo();

//------------------------------------------------------------------------------
// Gets all the reviews on the user being viewed and displayes them
//------------------------------------------------------------------------------
function populateReviews() {
    let rideCardTemplate = document.getElementById("reviewCardTemplate");
    let params = new URL(window.location.href); 
    let rideID = params.searchParams.get("docID");

    //gets data and sets it to the template
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
            let reviewCard = rideCardTemplate.content.cloneNode(true);


            reviewCard.querySelector(".title").innerHTML = title;
            reviewCard.querySelector(".time").innerHTML = new Date(time).toLocaleString();
            reviewCard.querySelector(".experience").innerHTML = `Experience: ${experience}`;
            reviewCard.querySelector(".attitude").innerHTML = `Attitude: ${attitude}`;
            reviewCard.querySelector(".clean").innerHTML = `Clean: ${clean}`;
            reviewCard.querySelector(".quick").innerHTML = `Quick: ${quick}`;
            reviewCard.querySelector( ".description").innerHTML = `Description: ${description}`;

            // Populate the star rating based on the rating value
			let starRating = "";
            for (let i = 0; i < rating; i++) {
                starRating += '<span class="material-icons">star</span>';
            }
            for (let i = rating; i < 5; i++) {
                starRating += '<span class="material-icons">star_outline</span>';
            }
            reviewCard.querySelector(".star-rating").innerHTML = starRating;
            document.getElementById("reviews-go-here").appendChild(reviewCard);
        });
    });
}
populateReviews();