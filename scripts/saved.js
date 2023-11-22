//----------------------------------------------------------
// This function is the only function that's called.
// This strategy gives us better control of the page.
//----------------------------------------------------------
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore(user);
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

//----------------------------------------------------------
// Wouldn't it be nice to see the User's Name on this page?
// Let's do it!  (Thinking ahead:  This function can be carved out, 
// and put into script.js for other pages to use as well).
//----------------------------------------------------------//----------------------------------------------------------
function insertNameFromFirestore(user) {
            db.collection("users").doc(user.uid).get().then(userDoc => {
                console.log(userDoc.data().name)
                userName = userDoc.data().name;
                console.log(userName)
                document.getElementById("name-goes-here").innerHTML = userName;
            })

}

//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) 
// and dynamically displays them in the gallery
//----------------------------------------------------------
function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

					  // Get the Array of bookmarks
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);
						
						// Get pointer the new card template
            let newcardTemplate = document.getElementById("savedCardTemplate");

						// Iterate through the ARRAY of bookmarked hikes (document ID's)
            bookmarks.forEach(thisHikeID => {
                console.log(thisHikeID);
                db.collection("posts").doc(thisHikeID).get().then(doc => {
                    var poster = doc.data().posterName; 
                    var from = doc.data().from;  // get value of the "details" key
				    var to = doc.data().to;    //get unique ID to each hike to be used for fetching right image
                    var price = doc.data().price; //gets the length field
                    var docID = doc.id;
                    var posterID = doc.data().posterUID;
                    let newcard = newcardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.


                    //update title and some pertinant information
                    //update title and text and image
                    newcard.querySelector('.card-title').innerHTML = poster;
                    newcard.querySelector('.card-length').innerHTML = from;
                    

										//Finally, attach this new card to the gallery
                    hikeCardGroup.appendChild(newcard);
                })
            });
        })
}