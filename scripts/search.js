//Global variable pointing to the current user's Firestore document
var currentUser;   

//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            displayCardsDynamically("posts");
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();   

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("hikeCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection)   //the collection called "hikes"
        .get()
        .then(allposts=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allposts.forEach(doc => { //iterate thru each doc
                var poster = doc.data().posterName; 
                var dt = doc.data().date + " " + doc.data().time;
                var from = doc.data().from;  // get value of the "details" key
				var to = doc.data().to;    //get unique ID to each hike to be used for fetching right image
                //var hikeLength = doc.data().price; //gets the length field
                var docID = doc.id;
                var posterID = doc.data().posterUID;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = poster;
                newcard.querySelector('.card-text').innerHTML = "From: " + from;
                newcard.querySelector('.card-text2').innerHTML = "To: " + to;
                newcard.querySelector('a').href = "users.html?docID="+posterID;
                newcard.querySelector('.card-href').href = "eachpost.html?docID="+docID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('i').onclick = () => updateBookmark(docID);
                newcard.querySelector('.card-length').innerHTML = dt;

                currentUser.get().then(userDoc => {
                    let bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    } else {
                        document.getElementById('save-' + docID).innerText = 'bookmark_border';
                    }
                });

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })


}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function updateBookmark(hikeDocID) {
    currentUser.get().then(userDoc => {
        let bookmarks = userDoc.data().bookmarks;
        let iconID = 'save-' + hikeDocID;
        let isBookmarked = bookmarks.includes(hikeDocID);

        if (isBookmarked) {
            // Remove bookmark
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(hikeDocID)
            }).then(() => {
                console.log("Bookmark removed for " + hikeDocID);
                document.getElementById(iconID).innerText = 'bookmark_border';
            });
        } else {
            // Add bookmark
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeDocID)
            }).then(() => {
                console.log("Bookmark added for " + hikeDocID);
                document.getElementById(iconID).innerText = 'bookmark';
            });
        }
    });
}
