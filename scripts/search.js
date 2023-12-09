var currentUser;   

//------------------------------------------------------------------------------
// calls all functions
//------------------------------------------------------------------------------
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
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
// Dislpays all rides
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("ridesTemplate"); 
    db.collection(collection)
        .get()
        .then(allposts=> {
            allposts.forEach(doc => { 
                var poster = doc.data().posterName; 
                var dt = doc.data().date + " " + doc.data().time;
                var from = doc.data().from; 
				var to = doc.data().to; 
                var docID = doc.id;
                var posterID = doc.data().posterUID;
                let newcard = cardTemplate.content.cloneNode(true); 

                newcard.querySelector('.card-title').innerHTML = poster;
                newcard.querySelector('.card-text').innerHTML = "From: " + from;
                newcard.querySelector('.card-text2').innerHTML = "To: " + to;
                newcard.querySelector('a').href = "users.html?docID="+posterID;
                newcard.querySelector('.card-href').href = "eachpost.html?docID="+docID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('i').onclick = () => updateBookmark(docID), console.log(docID);;
                newcard.querySelector('.card-length').innerHTML = dt;

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
                document.getElementById(collection + "-go-here").appendChild(newcard);
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