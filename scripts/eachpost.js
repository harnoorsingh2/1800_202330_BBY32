function displayPostInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    console.log( ID );

    let cardTemplate = document.getElementById("hikeCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection("posts")   //the collection called "hikes"
        .doc( ID )
        .get()
        .then(doc=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
                var poster = doc.data().posterName; 
                var d = doc.data().date 
                var time = doc.data().time;
                var from = doc.data().from;  // get value of the "details" key
				var to = doc.data().to;    //get unique ID to each hike to be used for fetching right image
                //var hikeLength = doc.data().price; //gets the length field
                var docID = doc.id;
                var posterID = doc.data().posterUID;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = "Posted by: " + poster;
                newcard.querySelector('.card-length').innerHTML = "Date: " + d;
                newcard.querySelector('.card-length2').innerHTML = "Time: " + time;
                newcard.querySelector('.card-text').innerHTML = "From: " + from;
                newcard.querySelector('.card-text2').innerHTML = "To: " + to;
                newcard.querySelector('.card-text3').innerHTML = "Availible Seats: " + doc.data().carSeats;//seats
                newcard.querySelector('.card-text4').innerHTML = "Price: " + doc.data().price;//price
                newcard.querySelector('.card-text5').innerHTML = "Vehicle: " + doc.data().car;//car

                newcard.querySelector('a').href = "users.html?docID="+posterID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('i').onclick = () => saveBookmark(docID);
                
                document.getElementById("info-go-here").appendChild(newcard);
        })

}
displayPostInfo();

function saveHikeDocumentIDAndRedirect(){
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('hikeDocID', ID);
    window.location.href = 'review.html';
}

// function populateReviews() {
//     console.log("test");
//     let hikeCardTemplate = document.getElementById("reviewCardTemplate");
//     let hikeCardGroup = document.getElementById("reviewCardGroup");

//     let params = new URL(window.location.href); // Get the URL from the search bar
//     let hikeID = params.searchParams.get("docID");

    // // Double-check: is your collection called "Reviews" or "reviews"?
    // db.collection("reviews")
    //     .where("hikeDocID", "==", hikeID)
    //     .get()
    //     .then((allReviews) => {
    //         reviews = allReviews.docs;
    //         console.log(reviews);
    //         reviews.forEach((doc) => {
    //             var title = doc.data().title;
    //             var level = doc.data().level;
    //             var season = doc.data().season;
    //             var description = doc.data().description;
    //             var flooded = doc.data().flooded;
    //             var scrambled = doc.data().scrambled;
    //             var time = doc.data().timestamp.toDate();
    //             var rating = doc.data().rating; // Get the rating value
    //             console.log(rating)

    //             console.log(time);

    //             let reviewCard = hikeCardTemplate.content.cloneNode(true);
    //             reviewCard.querySelector(".title").innerHTML = title;
    //             reviewCard.querySelector(".time").innerHTML = new Date(
    //                 time
    //             ).toLocaleString();
    //             reviewCard.querySelector(".level").innerHTML = `Level: ${level}`;
    //             reviewCard.querySelector(".season").innerHTML = `Season: ${season}`;
    //             reviewCard.querySelector(".scrambled").innerHTML = `Scrambled: ${scrambled}`;
    //             reviewCard.querySelector(".flooded").innerHTML = `Flooded: ${flooded}`;
    //             reviewCard.querySelector( ".description").innerHTML = `Description: ${description}`;

    //             // Populate the star rating based on the rating value
                
	//               // Initialize an empty string to store the star rating HTML
	// 							let starRating = "";
	// 							// This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
    //             for (let i = 0; i < rating; i++) {
    //                 starRating += '<span class="material-icons">star</span>';
    //             }
	// 							// After the first loop, this second loop runs from i=rating to i<5.
    //             for (let i = rating; i < 5; i++) {
    //                 starRating += '<span class="material-icons">star_outline</span>';
    //             }
    //             reviewCard.querySelector(".star-rating").innerHTML = starRating;

    //             hikeCardGroup.appendChild(reviewCard);
    //         });
    //     });
// }

// populateReviews();
