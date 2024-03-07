let sing = [];
let sang = [];

async function getSongs() {
  try {
    let data = await axios.get("/api/", {});
    sing = data.data;
    sang = sing.songs;

    const nextBtn = document.querySelector(".fa-forward");
    const previousBtn = document.querySelector(".fa-backward");
    const durationTime = document.querySelector(".duration");
    const remainingTime = document.querySelector(".remaining");
    const rangeBar = document.querySelector(".range");
    const musicName = document.querySelector(".music-name");
    const musicThumbnail = document.querySelector(".music-player");
    const musicImage = document.querySelector(".music-thumbnail");
    const playRepeat = document.querySelector(".fa-redo-alt");
    const playShuffle = document.querySelector(".fa-random");
    const playBtn = document.querySelector(".fa-play");
    let isPlaying = true;
    let indexSong = 0;
    let isShuffle = false;
    let timer;

    let audioPlayer = new Audio();
    playRepeat.addEventListener("click", toggleRepeat);

    function toggleRepeat() {
      if (audioPlayer.loop) {
        audioPlayer.loop = false;
        playRepeat.style.color = "#000"; // Màu sắc khi nút tắt
      } else {
        audioPlayer.loop = true;
        playRepeat.style.color = "#FFDAB9"; // Màu sắc khi nút mở
      }
    }

    playShuffle.addEventListener("click", toggleShuffle);

    function toggleShuffle() {
      if (isShuffle) {
        isShuffle = false;
        playShuffle.style.color = "#000";
        sang = sing.songs.slice();
        if (isPlaying) {
          changeSong();
        }
      } else {
        isShuffle = true;
        playShuffle.style.color = "#FFDAB9";
        const tempSongs = sing.songs.slice();
        sang = tempSongs.sort(() => Math.random() - 0.5);
      }
    }

    // Function to change song
    function changeSong() {
      indexSong = indexSong % sang.length;
      init();
      audioPlayer.src = sang[indexSong].file;
      audioPlayer.addEventListener("canplay", function () {
        audioPlayer.play();
        // Update background color when changing song
        updateBackgroundColor();
      });
    }

    // Function to handle click on song item
    function songItemClickHandler(index) {
      return function () {
        indexSong = index;
        changeSong();
        $("#songList").collapse("hide");

        // Cuộn trang đến vị trí của bài hát được chọn
        const currentSongItem = document.getElementById(`song-item-${index}`);
        currentSongItem.scrollIntoView({ behavior: "smooth", block: "center" });
      };
    }
    audioPlayer.addEventListener("ended", function () {
      indexSong = (indexSong + 1) % sang.length;
      changeSong();
    });

    playBtn.addEventListener("click", playPause);

    function playPause() {
      if (isPlaying) {
        musicThumbnail.classList.add("is-playing");
        if (audioPlayer.src === "") {
          audioPlayer.src = sang[indexSong].file;
          audioPlayer.play();
        } else {
          audioPlayer.play();
        }
        isPlaying = false;
        timer = setInterval(displayTimer, 500);
        playBtn.classList.remove("fa-play");
        playBtn.classList.add("fa-pause");
      } else {
        musicThumbnail.classList.remove("is-playing");
        audioPlayer.pause();
        isPlaying = true;
        clearInterval(timer);
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("fa-play");
      }
    }

    nextBtn.addEventListener("click", () => {
      indexSong = (indexSong + 1) % sang.length;
      init();
      audioPlayer.src = sang[indexSong].file;
      audioPlayer.addEventListener("canplay", function () {
        audioPlayer.play();
      });
    });

    previousBtn.addEventListener("click", () => {
      indexSong = (indexSong - 1 + sang.length) % sang.length;
      init();
      audioPlayer.src = sang[indexSong].file;
      audioPlayer.addEventListener("canplay", function () {
        audioPlayer.play();
      });
    });

    function displayTimer() {
      const { duration, currentTime } = audioPlayer;
      if (!isNaN(duration)) {
        rangeBar.max = duration;
        durationTime.textContent = formatTimer(duration);
      }
      rangeBar.value = currentTime;
      remainingTime.textContent = formatTimer(currentTime);
    }

    function formatTimer(number) {
      const minutes = Math.floor(number / 60);
      const seconds = Math.floor(number - minutes * 60);
      return `${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    }

    rangeBar.addEventListener(
      "change",
      () => (audioPlayer.currentTime = rangeBar.value)
    );

    function init() {
      const currentSong = sang[indexSong];
      musicName.textContent = currentSong.title;
      musicName.style.fontWeight = "bold";
      musicImage.src = currentSong.image;

      // Xóa bỏ tất cả các lớp active trên danh sách bài hát
      document.querySelectorAll(".song-item").forEach((item) => {
        item.classList.remove("active");
        item.style.backgroundColor = "";
        item.style.boxShadow = "";
      });

      // Đánh dấu bài hát hiện tại đang được phát
      const currentSongItem = document.querySelector(
        `.song-item:nth-child(${indexSong + 1})`
      );

      // Update background color for a different element
      currentSongItem.style.backgroundColor = "#FFDAB9";
      currentSongItem.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

      updateBackgroundColor();
    }

    const songListContainer = document.querySelector(".list-group.mt-3");
    songListContainer.innerHTML = "";

    sang.forEach((song, index) => {
      const songItem = document.createElement("div");
      songItem.classList.add(
        "song-item",
        "list-group-item",
        "list-group-item-action",
        "d-flex",
        "align-items-center"
      );
      songItem.style.cursor = "pointer";
      songItem.id = `song-item-${index}`;

      const thumbnailImg = document.createElement("img");
      thumbnailImg.src = song.image;
      thumbnailImg.alt = song.title;
      thumbnailImg.classList.add("song-thumbnail");
      thumbnailImg.style.width = "50px";

      const songTitle = document.createElement("div");
      songTitle.textContent = song.title;
      songTitle.classList.add("song-title", "mx-2");

      songItem.appendChild(thumbnailImg);
      songItem.appendChild(songTitle);

      songItem.addEventListener("click", songItemClickHandler(index));

      songListContainer.appendChild(songItem);
    });

    displayTimer();
    document.getElementById("loading-message").style.display = "none";
  } catch (e) {
    console.log(e);
  }
}

window.onload = getSongs;

// ================================================================ Chuyển màu nền =================================================================

// Get the music thumbnail element
var thumbnail = document.getElementById("thumbnail");

// Function to get the average color of an image
function getAverageRGB(imgEl) {
  var blockSize = 5, // only visit every 5 pixels
    defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
    canvas = document.createElement("canvas"),
    context = canvas.getContext && canvas.getContext("2d"),
    data,
    width,
    height,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;

  if (!context) {
    return defaultRGB;
  }

  height = canvas.height =
    imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    /* security error, img on diff domain */ alert("x");
    return defaultRGB;
  }

  length = data.data.length;

  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
}

// Function to convert RGB to Hex
function rgbToHex(rgb) {
  return (
    "#" +
    ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
  );
}

var songListButton = document.querySelector(".song-list button");

// Get the average color of the thumbnail
var averageColor = getAverageRGB(thumbnail);

// Convert RGB to Hex
var backgroundColor = rgbToHex(averageColor);

// Kiểm tra màu nền có thuộc loại màu sáng hay màu tối
var brightness =
  (averageColor.r * 299 + averageColor.g * 587 + averageColor.b * 114) / 1000;
var textColor;

// Chọn màu chữ phù hợp dựa trên độ sáng của màu nền
if (brightness > 125) {
  textColor = "#000"; // Màu đen cho màu nền sáng
} else {
  textColor = "#fff"; // Màu trắng cho màu nền tối
}

// Set màu chữ cho nút song-list
songListButton.style.color = textColor;

// Set the background color of the container
document.body.style.backgroundColor = backgroundColor;
songListButton.style.backgroundColor = backgroundColor;

function updateBackgroundColor() {
  // Lấy màu nền của ảnh đại diện nhạc
  var thumbnail = document.querySelector(".music-thumbnail");
  var songListButton = document.querySelector(".song-list button");

  // Lấy màu trung bình của ảnh đại diện
  var averageColor = getAverageRGB(thumbnail);

  // Chuyển đổi màu nền từ RGB sang Hex
  var backgroundColor = rgbToHex(averageColor);

  // Kiểm tra màu nền có thuộc loại màu sáng hay màu tối
  var brightness =
    (averageColor.r * 299 + averageColor.g * 587 + averageColor.b * 114) / 1000;
  var textColor;

  // Chọn màu chữ phù hợp dựa trên độ sáng của màu nền
  if (brightness > 125) {
    textColor = "#000"; // Màu đen cho màu nền sáng
  } else {
    textColor = "#fff"; // Màu trắng cho màu nền tối
  }

  // Set màu chữ cho nút song-list
  songListButton.style.color = textColor;

  // Set màu nền cho container với animation
  document.body.style.transition = "background-color 1s ease"; // Thêm hiệu ứng chuyển màu nền
  document.body.style.backgroundColor = backgroundColor;
  songListButton.style.backgroundColor = backgroundColor;
}
