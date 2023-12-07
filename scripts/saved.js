//----------------------------------------------------------
// This function is the only function that's called.
// This strategy gives us better control of the page.
//----------------------------------------------------------
var currentUser


function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            insertNameFromFirestore(user);
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });

    currentUser.get().then(userDoc => {
                    let bookmarks = userDoc.data().bookmarks;
                    if (bookmarks == undefined) {
                        currentUser.update({
                            bookmarks: firebase.firestore.FieldValue.arrayUnion("none")
                        })
                    }

                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    } else {
                        document.getElementById('save-' + docID).innerText = 'bookmark_border';
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
						// Get pointer the new card template
            let cardTemplate = document.getElementById("savedCardTemplate");
            let newcard = cardTemplate.content.cloneNode(true);

						// Iterate through the ARRAY of bookmarked hikes (document ID's)
            bookmarks.forEach(rideID => {
                console.log(rideID);
                db.collection("posts").doc(rideID).get().then(doc => {
                    
                    var from = doc.data().from;  // get value of the "details" key
				    var to = doc.data().to;    //get unique ID to each hike to be used for fetching right image
                    var price = doc.data().price; //gets the length field
                    var docID = doc.id;
                    var posterID = doc.data().posterUID;
                    var dt = doc.data().date + " " + doc.data().time;
                    var poster = doc.data().posterName; 

                    //update title and some pertinant information
                    //update title and text and image
                    newcard.querySelector('.card-title').innerHTML = poster;
                newcard.querySelector('.card-text').innerHTML = "From: " + from;
                newcard.querySelector('.card-text2').innerHTML = "To: " + to;
                newcard.querySelector('a').href = "users.html?docID=" + posterID;
                newcard.querySelector('.card-href').href = "eachpostsaved.html?docID="+docID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('i').onclick = () => updateBookmark(docID), console.log(docID);;
                newcard.querySelector('.card-length').innerHTML = dt;
                    
                currentUser.get().then(userDoc => {
                        //get the user name
                        var bookmarks = userDoc.data().bookmarks;
                        if (bookmarks == undefined) {
                            currentUser.update({
                                bookmarks: firebase.firestore.FieldValue.arrayUnion("none")
                            })
                        }
                        if (bookmarks.includes(docID)) {
                           document.getElementById('save-' + docID).innerText = 'bookmark';
                        } else {
                        document.getElementById('save-' + docID).innerText = 'bookmark_border';
                        }
                  })
										//Finally, attach this new card to the gallery
                    document.getElementById("saved-go-here").appendChild(newcard);
                })
            });
        })
}

function updateBookmark(rideDocID) {
    currentUser.get().then(userDoc => {
        let bookmarks = userDoc.data().bookmarks;
        let iconID = 'save-' + rideDocID;
        let isBookmarked = bookmarks.includes(rideDocID);

        if (isBookmarked) {
            // Remove bookmark
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(rideDocID)
            }).then(() => {
                console.log("Bookmark removed for " + rideDocID);
                document.getElementById(iconID).innerText = 'bookmark_border';
                });
        } else {
            // Add bookmark
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(rideDocID)
            }).then(() => {
                console.log("Bookmark added for " + rideDocID);
                document.getElementById(iconID).innerText = 'bookmark';
                    });
        }
    });
    }