
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const dl = document.getElementById('download');

const soundClips = document.querySelector('.sound-clips');


  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

     navigator.mediaDevices.getUserMedia ({ audio: true }).then(function(stream) {


          let chunks = []; // used to hold audio chunks recorded
          const mediaRec = new MediaRecorder(stream);

          // record button is clicked
          recordBtn.onclick = function() {
            mediaRec.start();
            console.log(mediaRec.state);
          }

          // record stop button is clicked
          stopBtn.onclick = function() {
            mediaRec.stop();
            console.log(mediaRec.state);
          }

          // push to export
          mediaRec.ondataavailable = function(e) {
            chunks.push(e.data);
          }

          // export blob to file and post
          mediaRec.onstop = function(e) {

            const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            chunks = []; // clear chunks for next recording
            const url = window.URL.createObjectURL(blob);
            //audio.src = url;


            var link = document.getElementById('download')
            link.href = url;
            link.download = "test123.wav";


            var filename = "test123.wav"
            var data = new FormData();
            data.append('file', blob);

/*
            $.ajax({
              url :  "update",
              type: 'POST',
              data: data,
              contentType: false,
              processData: false,
              success: function(data) {
                alert("success!");
              },
              error: function() {
                alert("fail");
              }
            });
*/

            // request to post
            var xhr=new XMLHttpRequest();
            xhr.onload=function(e) {
                if(this.readyState === 4) {
                    console.log("test");
                    console.log("Server returned: ",e.target.responseText);
                }
            };
            //var f=new FormData();
            //f.append("audio_data",blob, "filename.wav");
            xhr.open("POST","upload",true);
            xhr.send(data);
          }


        })

        // Error occured
        .catch(function(e) {
           console.log(e);
        }
     );
  } else {
     alert("Your web browser does not support recording audio for Ensemble");
  }
