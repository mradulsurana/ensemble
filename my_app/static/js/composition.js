
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("pButton");
const pauseBtn = document.getElementById("sButton");
const dl = document.getElementById('download');
const mButton = document.getElementById("mergeBtn");
var waves = [];
var recordPercent;
var recordStartPercent;
var startTime;
var endTime;
var sources = ["../static/audio/bensound-ukulele.mp3"];
var recordedFilename;

var wavesurfer = WaveSurfer.create({
    autoCenter: true,
    barWidth: 3,
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

    function get(src) {
        return fetch(src)
          .then(function(response) {
            return response.arrayBuffer()
          })

      }



      function stopMix(duration, ...media) {
        setTimeout(function(media) {
          media.forEach(function(node) {
            node.stop()
          })
        }, duration, media)

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
        recordPercent = (endTime-startTime)/waves[0].getDuration();
        recordStartPercent = startTime/waves[0].getDuration();
        console.log(recordPercent);
        console.log(recordStartPercent);
        console.log("start");
        console.log(waves[0].getDuration());
        console.log(wavesurfer.getDuration());
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
            startTime = wavesurfer.getCurrentTime();
          }

          // record stop button is clicked
          stopBtn.onclick = function() {
            mediaRec.stop();
            console.log(mediaRec.state);
            wavesurfer.pause();
            endTime = wavesurfer.getCurrentTime();
            wavesurfer.seekTo(startTime/wavesurfer.getDuration());

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
                    recordedFilename = e.target.responseText;
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

  function merge() {
  sources.push("../static/audio/"+recordedFilename);
  var chunks = [];
  var channels = [[0, 1], [1, 0]];
  var audioContext = new AudioContext();
  var player = new Audio();
  var merger = audioContext.createChannelMerger(2);
  var splitter = audioContext.createChannelSplitter(2);
  var mixedAudio = audioContext.createMediaStreamDestination();
  var duration = wavesurfer.getDuration()*1000;
  var context;
  var recorder;
  var audioDownload;

  Promise.all(sources.map(get)).then(function(data) {
      return Promise.all(data.map(function(buffer, index) {
          return audioContext.decodeAudioData(buffer)
            .then(function(bufferSource) {
              audioContext.resume();
              var channel = channels[index];
              var source = audioContext.createBufferSource();
              source.buffer = bufferSource;
              source.connect(splitter);
              splitter.connect(merger, channel[0], channel[1]);
              return source
            })
        }))
        .then(function(audionodes) {
          audioContext.resume();
          merger.connect(mixedAudio);
          merger.connect(audioContext.destination);
          recorder = new MediaRecorder(mixedAudio.stream);
          recorder.start(0);
          audionodes.forEach(function(node) {
            node.start(0)

          });

          stopMix(duration, ...audionodes, recorder);
          recorder.ondataavailable = function(event) {
            chunks.push(event.data);
          };

          recorder.onstop = function(event) {

            var blob = new Blob(chunks, {
              "type": "audio/ogg; codecs=opus"
            });

            audioDownload = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.download = "merged.wav";


              var filename = "merged.wav";
              var data = new FormData();
              data.append('file', blob);
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
            /**
            a.href = audioDownload;
            a.innerHTML = a.download;
            player.src = audioDownload;
            document.body.appendChild(a);
            document.body.appendChild(player);
            */

          };
        })
    })

    .catch(function(e) {

      console.log(e)

    });
  }

  mButton.addEventListener('click',merge);
