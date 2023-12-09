var currentUser

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "./login.html";
        }
    })

//---------------------------------------------------
// Shows the post information and accepts bookmarks.
//---------------------------------------------------
function displayPostInfo() {
    let params = new URL( window.location.href ); 
    let ID = params.searchParams.get( "docID" );
    console.log( ID );

    let cardTemplate = document.getElementById("eachPostCardTemplate");

    db.collection("posts")
        .doc( ID )
        .get()
        .then(doc=> {
          
                var poster = doc.data().posterName; 
                var d = doc.data().date 
                var time = doc.data().time;
                var from = doc.data().from; 
				var to = doc.data().to; 
               
                var docID = doc.id;
                var posterID = doc.data().posterUID;

                let newcard = cardTemplate.content.cloneNode(true); 

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = "Posted by: " + poster;
                newcard.querySelector('.card-length').innerHTML = "Date: " + d;
                newcard.querySelector('.card-length2').innerHTML = "Time: " + time;
                newcard.querySelector('.card-text').innerHTML = "From: " + from;
                newcard.querySelector('.card-text2').innerHTML = "To: " + to;
                newcard.querySelector('.card-textx').innerHTML = "Pickup Location: " + doc.data().pickup;
                newcard.querySelector('.card-text3').innerHTML = "Availible Seats: " + doc.data().carSeats;//seats
                newcard.querySelector('.card-text4').innerHTML = "Price: " + doc.data().price;//price
                newcard.querySelector('.card-text5').innerHTML = "Vehicle: " + doc.data().car;//car

                newcard.querySelector('a').href = "./users.html?docID="+posterID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('i').onclick = () => updateBookmark(docID);
                
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

                document.getElementById("info-go-here").appendChild(newcard);
        })

}
displayPostInfo();

//---------------------------------------------------
// Updates bookmarks.
//---------------------------------------------------
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


