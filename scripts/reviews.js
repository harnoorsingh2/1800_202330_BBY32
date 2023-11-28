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

                document.getElementById("reviews-go-here").appendChild(reviewCard);
            });
        });
}

populateReviews();