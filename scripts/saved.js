var currentUser

//----------------------------------------------------------
// Runs all the functions 
//----------------------------------------------------------
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
// Gets user's name
//----------------------------------------------------------
function insertNameFromFirestore(user) {
    db.collection("users").doc(user.uid).get().then(userDoc => {
        console.log(userDoc.data().name)
        userName = userDoc.data().name;
        console.log(userName)
    })
}

//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) and dislpays them
//----------------------------------------------------------
function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
    .then(userDoc => {

        var bookmarks = userDoc.data().bookmarks;				
        let cardTemplate = document.getElementById("savedCardTemplate");
        let newcard = cardTemplate.content.cloneNode(true);
        bookmarks.forEach(rideID => {
        db.collection("posts").doc(rideID).get().then(doc => {
            var from = doc.data().from;  
			var to = doc.data().to;   
            var price = doc.data().price;
            var docID = doc.id;
            var posterID = doc.data().posterUID;
            var dt = doc.data().date + " " + doc.data().time;
            var poster = doc.data().posterName; 

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
                    document.getElementById("saved-go-here").appendChild(newcard);
                })
            });
        })
}

//---------------------------------------------------
// Updates the bookmark 
// (if bookmarked, un bookmark. if not bookmarked, bookmark)
//---------------------------------------------------
function updateBookmark(rideDocID) {
    currentUser.get().then(userDoc => {
        let bookmarks = userDoc.data().bookmarks;
        let iconID = 'save-' + rideDocID;
        let isBookmarked = bookmarks.includes(rideDocID);

        // Remove bookmark
        if (isBookmarked) {    
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