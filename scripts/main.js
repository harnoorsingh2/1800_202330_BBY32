//---------------------------------------------------
// Returns users names from firebase.
//---------------------------------------------------
function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
       
        if (user) {
            
            console.log(user.uid); 
            console.log(user.displayName);
            // Splices name in half, so if u put a first and last name only returns first name.
            userName = user.displayName.split(' ').slice(0, -1).join(' ');
            
           
            document.getElementById("name-goes-here").innerText = userName;    

          

        } else {
          
        }
    });
}
getNameFromAuth(); 

//---------------------------------------------------------------
// Returns quotes from firebase depending on the day of the week.
//---------------------------------------------------------------
function readQuote(day) {
    db.collection("quotes").doc(day)                                                     
      .onSnapshot(dayDoc => {                                                             
           console.log("current document data: " + dayDoc.data());                         
           document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;     
           
      })
}
const date = new Date();

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const currentDayOfWeek = daysOfWeek[date.getDay()];

readQuote(currentDayOfWeek);  