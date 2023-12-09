var savedUserId

//---------------------------------------------------
// gets every review on the user and puts it into forms
//---------------------------------------------------
function populateReviews() {
    firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
            //gets some data fields of the user
            .then(userDoc => {       
                userName = userDoc.data().name;
                userPhone = userDoc.data().phone;
                userEmail = userDoc.data().email;
                const userId = firebase.auth().currentUser.uid;
                savedUserId = userId;
                let rideCardTemplate = document.getElementById("reviewCardTemplate");
                let rideCardGroup = document.getElementById("reviewCardGroup");
                let params = new URL(window.location.href); 
                let rideID = params.searchParams.get("docID");

                //gets review data
                db.collection("reviews")
                .where("revieweeID", "==", savedUserId)
                .get()
                then((allReviews) => {
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
                        //console.log(rating)
                        //console.log(time);

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
            })
        }
    })
}
populateReviews();