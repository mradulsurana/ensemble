
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("pButton");
const pauseBtn = document.getElementById("sButton");
const dl = document.getElementById('download');
var waves = [];

var wavesurfer = WaveSurfer.create({
    autoCenter: true,
    barWidth: 10,
    container: '#waveform',
    waveColor: 'green',
    progressColor: 'purple'
})

waves.push(wavesurfer);


wavesurfer.load('../static/audio/bensound-ukulele.mp3');

const soundClips = document.querySelector('.sound-clips');

    playBtn.onclick = function() {
        var x;
        for(x=0;x<waves.length;x++) {
            waves[x].play();
        }
        
    }

    pauseBtn.onclick = function() {
        var x;
        for(x=0;x<waves.length;x++) {
            waves[x].pause();
        }
    }

    function createGraph(blob) {
        var wavesurfer = WaveSurfer.create({
            barWidth: 10,
            container: '#waveform',
            waveColor: 'orange',
            progressColor: 'blue'
        })
        
        wavesurfer.loadBlob(blob);
        console.log(wavesurfer.getCurrentTime());
        wavesurfer.seekTo(0);
        waves.push(wavesurfer);
    }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

     navigator.mediaDevices.getUserMedia ({ audio: true }).then(function(stream) {


          let chunks = []; // used to hold audio chunks recorded
          const mediaRec = new MediaRecorder(stream);

          // record button is clicked
          recordBtn.onclick = function() {
            mediaRec.start();
            console.log(mediaRec.state);
            wavesurfer.play();
          }

          // record stop button is clicked
          stopBtn.onclick = function() {
            mediaRec.stop();
            console.log(mediaRec.state);
            wavesurfer.pause();
            wavesurfer.seekTo(0);
            
          }

          // push to export
          mediaRec.ondataavailable = function(e) {
            chunks.push(e.data);
          }

          // export blob to file and post
          mediaRec.onstop = function(e) {

            const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            createGraph(blob);
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
