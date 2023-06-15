let sing = [];
let sang = [];
async function getSongs() {
  try {
    let data = await axios.get("/musics/mp3-player/api/", {});
    sing = data.data;
    sang = sing.songs;
    console.log(sang);

    const song = document.getElementById("song");
    const playBtn = document.querySelector(".player-inner");
    const nextBtn = document.querySelector(".play-forward");
    const previousBtn = document.querySelector(".play-back");
    const durationTime = document.querySelector(".duration");
    const remainingTime = document.querySelector(".remaining");
    const rangeBar = document.querySelector(".range");
    const musicName = document.querySelector(".music-name");
    const musicThumbnail = document.querySelector(".music-thumb");
    const musicImage = document.querySelector(".music-thumb img");
    const playRepeat = document.querySelector(".play-repeat");
    const playShuffle = document.querySelector(".play-shuffle");
    let repeatCount = 0;
    playShuffle.addEventListener("click", shuffle);
    function shuffle() {
      if (isRandom) {
        isRandom = false;
        playShuffle.style.color = "black";
      } else {
        isRandom = true;
        playShuffle.style.color = "#ffb86c";
      }
    }
    playRepeat.addEventListener("click", repeat);
    function repeat() {
      if (isRepeat) {
        isRepeat = false;
        playRepeat.style.color = "black";
      } else {
        isRepeat = true;
        playRepeat.style.color = "#ff6bcb";
      }
    }
    let isPlaying = true;
    let indexSong = 0;
    let isRepeat = false;
    let isRandom = false;
    let timer = setInterval(displayTimer, 500);

    nextBtn.addEventListener("click", function () {
      changeSong(1);
    });
    previousBtn.addEventListener("click", function () {
      changeSong(-1);
    });
    song.addEventListener("ended", handleEndedSong);
    function handleEndedSong() {
      repeatCount++;
      if (isRepeat) {
        // handleRepeat
        isPlaying = true;
        playPause();
      } else {
        // repeatCount === 0;
        // playRepeat.style.color = "black";
        changeSong(1);
      }
    }
    function changeSong(dir) {
      if (dir === 1) {
        //next song
        indexSong++;
        if (indexSong >= sang.length && isRandom === false) {
          indexSong = 0;
        } else if (indexSong < sang.length && isRandom === true) {
          let musicRandom = Number.parseInt(Math.random() * sang.length);
          indexSong = musicRandom;
          console.log(musicRandom);
        }
        isPlaying = true;
      } else if (dir === -1) {
        //previous song
        indexSong--;
        if (indexSong < 0) {
          indexSong = sang.length - 1;
        }
        isPlaying = true;
      }
      init(indexSong);
      // song.setAttribute("src", `./music/${sing[indexSong].file}`);
      playPause();
    }

    playBtn.addEventListener("click", playPause);

    function playPause() {
      if (isPlaying) {
        musicThumbnail.classList.add("is-playing");
        song.play();
        playBtn.innerHTML = `<ion-icon name="pause-circle-outline"></ion-icon>`;
        isPlaying = false;
        timer = setInterval(displayTimer, 500);
      } else {
        musicThumbnail.classList.remove("is-playing");
        song.pause();
        playBtn.innerHTML = `<ion-icon name="play-outline"></ion-icon>`;
        isPlaying = true;
        clearInterval(timer);
      }
    }
    function displayTimer() {
      const { duration, currentTime } = song;
      rangeBar.max = duration;
      rangeBar.value = currentTime;
      remainingTime.textContent = formatTimer(currentTime);
      if (!duration) {
        durationTime.textContent = "00:00";
      } else {
        durationTime.textContent = formatTimer(duration);
      }
    }
    function formatTimer(number) {
      const minutes = Math.floor(number / 60);
      const seconds = Math.floor(number - minutes * 60);
      return `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    }
    rangeBar.addEventListener("change", handleChangeBar);
    function handleChangeBar() {
      song.currentTime = rangeBar.value;
    }
    function init(indexSong) {
      song.setAttribute("src", `./${sang[indexSong].file}`);
      musicImage.setAttribute("src", sang[indexSong].image);
      musicName.textContent = sang[indexSong].title;
    }
    displayTimer();
    init(indexSong);
  } catch (e) {
    console.log(e);
  }
}
