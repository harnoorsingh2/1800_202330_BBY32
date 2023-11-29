let profilePic = document.getElementById("Avatar");
      let inputFile = document.getElementById("input-file");
      document.getElementById('personalInfoFields').disabled = false;
      inputFile.onchange = function() {
        profilePic.src = URL.createObjectURL(inputFile.files[0]);
      

      function savePFPImage() {
       //b) update user's document in Firestore
       currentUser.update({
                       image: profilePic.src
                       
                   })
                   .then(() => {
                       console.log("Image successfully updated!");
                   })
    document.getElementById('personalInfoFields').disabled = true; 
    console.log("Image sent to firebase");
   }    
}

document.getElementById('savePFP').onclick = function(){
    var uploadTask = firebase.storage().ref('Users/image/' + profilePic).put(files[0]);
    firebase.database().ref('Users/image/' + profilePic).set({
        Link: profilePic
    });

    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById('UpProgress').innerHTML = 'Upload'+progress+'%';

    },

    function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(url){
            ImgUrl = url;
        });

        firebase.database().ref("")
    }
    );
    
}
