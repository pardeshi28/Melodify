console.log("welcome to player")


currentSong = new Audio;
let songs;
let currFolder;

async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);//THis will Split the herf into two part before songs and after songs and show the after songs
    }
  }
  console.log(songs);



  //showing all the songs in playlist
  let songname = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songname.innerHTML = ""
  for (const song of songs) {
    songname.innerHTML = songname.innerHTML + `<li>
    
    <img src="img/music.svg" alt="" class="invert">
    <div class="info">
      <div>${song.replaceAll("%20", " ") || song.replaceAll("_", " ")}</div>
    </div>
    <div class="playnow">
      <span>Play Now</span>
      <img src="img/player.svg" class="invert" height="30px" width="30px">
    </div></li>`;
  }


  //Atttach an eevnt to the each songs
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    })
  })
}



const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track; //This is for one song play at a time
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track); //decodeURL is inbuild method that decode the url
  document.querySelector(".songtime").innerHTML = "00:00/00:00";


}

async function displayAllAlbums() {
  console.log("dipalying all ablums")
  let a = await fetch(`http://127.0.0.1:5500/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardcontainer = document.querySelector(".cards")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
  
    if (e.href.includes("/songs")) {
      let folder =e.href.split("/").slice(-1)[0];


      //get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
      let response = await a.json();
       cardcontainer.innerHTML = cardcontainer.innerHTML +`<div data-folder="Trending" class="card">
       <div class="play">
           <i class="fa-solid fa-circle-play" style="color: #07df20;"></i>
       </div>
       <img src="https://i.scdn.co/image/ab67706f00000002403f8ff596413f3d280026df" class="rounded">
       <h2>Haapy Tit</h2>
       <p>Ring in 2024 with your favorite party tracks!</p>
   </div>
   <div data-folder="Romantic" class="card">
       <div class="play">
           <i class="fa-solid fa-circle-play" style="color: #07df20;"></i>
       </div>
       <img src="/songs/${folder}/cover.jpg" class="rounded">
       <h2>${response.title}</h2>
       <p>${response.description}</p>
   </div>`
    }

    Array.from(document.querySelectorAll(".card")).forEach(e => {
      e.addEventListener("click", async item => {
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      })
    })

  }
}




async function main() {
  //getting all the songs list
  await getsongs("songs/Trending");
  playMusic(songs[0], true)  //This will show the fisrt song name on loaded


  //Display all the folder or playlist
  displayAllAlbums();




  //Atttach an event to an play,pause button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    }
    else {
      currentSong.pause()
      play.src = "img/player.svg"
    }

  })

  //converting the seconds to seconds:minutes
  function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "00"
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Ensure leading zeros for single-digit minutes and seconds
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return formattedMinutes + ':' + formattedSeconds;
  }


  //timeupdate
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} /${secondsToMinutesSeconds(currentSong.duration)} `//THis will give the time second:mintue of the plaung song

    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";


  })

  //Attching a click fun to seekbar 
  document.querySelector(".seekbar").addEventListener("click", e => {

    //getBoundingClientRect() it is inbulit method that give us current position value
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100; //THis will go the currenttime when we click on seekbar 

  })

  //Add an event listner to the humburgure
  document.querySelector(".humburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  })


  //Add an event listner to the close button for moblie view
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  })

  //Add an ebent Listner to previous button
  previous.addEventListener("click", () => {
    console.log("Previous Clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) > 0) {
      playMusic(songs[index - 1])
    }
  })


  //Add an ebent Listner to next button
  next.addEventListener("click", () => {
    console.log("next Clicked");
    let index1 = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index1 + 1) < songs.length) {
      playMusic(songs[index1 + 1])
    }
  })


  //Add an evnt listner to the volune range button
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  })


  //Load the playlist when clied on card
  Array.from(document.querySelectorAll(".card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    })
  })

  //Add an addevnt lister to the mute button
  document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("img/volume.svg")){
      e.target.src =  e.target.src.replace("img/volume.svg","img/mute.svg");
      currentSong.volume= 0;document.querySelector(".range").getElementsByTagName("input")[0].value=0; //If we click on volumw button then range become zero

    }
    else{
      e.target.src =  e.target.src.replace("img/mute.svg","img/volume.svg");
      currentSong.volume= 0.1;
      currentSong.volume= 0;document.querySelector(".range").getElementsByTagName("input")[0].value=50;
    }
  })
}
main();



