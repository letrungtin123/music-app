const musicAll = [
  {
    id: "music-0",
    name: "Die for you",
    artist: "The Weeknd",
    image: "./assets/images/theweeknd1.jpg",
    link: "./assets/music/DieForYou.mp3",
  },
  {
    id: "music-1",
    name: "I was never there",
    artist: "The Weeknd",
    image: "./assets/images/theweeknd2.jpg",
    link: "./assets/music/IWasNeverThere.mp3",
  },
  {
    id: "music-2",
    name: "Blinding lights",
    artist: "The Weeknd",
    image: "./assets/images/theweeknd3.jpg",
    link: "./assets/music/BlindingLights.mp3",
  },
];

const wrapper = document.querySelector(".wrapper");
const musicImage = wrapper.querySelector(".image-area img");
const musicName = wrapper.querySelector(".name");
const musicArtists = wrapper.querySelector(".artists");
const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = wrapper.querySelector(".btn-prev");
const nextBtn = wrapper.querySelector(".btn-next");
const mAudio = wrapper.querySelector("#m-audio");
const progressArea = wrapper.querySelector(".progress-area");
const progressBar = wrapper.querySelector(".progress-bar");
const start = wrapper.querySelector(".current-time");
const end = wrapper.querySelector(".max-duration");
const musicList = wrapper.querySelector(".music-list");
const closeMusicBtn = wrapper.querySelector("#close");
const ultag = wrapper.querySelector("ul");
const menulistBtn = wrapper.querySelector("#menu-list");

let musicIndex = 0;

// render li
for (let i = 0; i < musicAll.length; i++) {
  const item = musicAll[i];
  let litag = /* html */ `<li class="music-item" li-index="${i}">
       <div class="row">
         <span>${item.name}</span>
         <p class="artists">${item.artist}</p>
       </div>

       <audio class="${item.id}" src="${item.link}" type="audio/mp3"></audio>

       <span id="${item.id}" class="timer audio-duration m-list">02:00</span>
     </li>`;
  ultag.insertAdjacentHTML("beforeend", litag);

  // lấy ra các phần tử liên qua đến thẻ audio và thời gian bài hát
  const liAudioDurationTag = ultag.querySelector(`#${item.id}`);
  const liAudioTag = ultag.querySelector(`.${item.id}`);

  liAudioTag.addEventListener("loadeddata", () => {
    const duration = liAudioTag.duration;
    // tính toán ra phút, giây
    const min = Math.floor(duration / 60);
    let sec = Math.floor(duration % 60);
    if (sec < 10) {
      sec = "0" + sec;
    }
    liAudioDurationTag.innerText = `${min}:${sec}`;
  });
}

// load music
const loadMusic = (currentMusic) => {
  musicImage.src = currentMusic.image;
  musicName.innerText = currentMusic.name;
  musicArtists.innerText = currentMusic.artist;
  mAudio.src = currentMusic.link;
};

function clicked(liIndex) {
  musicIndex = liIndex;
  const currentMusic = musicAll[liIndex];
  loadMusic(currentMusic);
  playingSong();
  playMusic();
}

const litags = wrapper.querySelectorAll("li");
// playing music
function playingSong() {
  for (let i = 0; i < litags.length; i++) {
    const item = litags[i];

    if (item.classList.contains("playing")) {
      item.classList.remove("playing");
    }

    if (item.getAttribute("li-index") == musicIndex) {
      item.classList.add("playing");
    }

    item.addEventListener("click", () =>
      clicked(item.getAttribute("li-index"))
    );
  }
}

const playMusic = () => {
  playPauseBtn.classList.add("paused");
  playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  musicImage.classList.add("rotate");
  mAudio.play();
};

const pauseMusic = () => {
  playPauseBtn.classList.remove("paused");
  playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  musicImage.classList.remove("rotate");
  mAudio.pause();
};

// logic phát nhạc
mAudio.onloadedmetadata = () => {
  progressBar.max = mAudio.duration;
  progressBar.value = mAudio.currentTime;

  setInterval(() => {
    let min = Math.floor(mAudio.duration / 60);
    let sec = Math.floor(mAudio.duration % 60);
    let curMin = Math.floor(mAudio.currentTime / 60);
    let curSec = Math.floor(mAudio.currentTime % 60);

    if (sec < 10) {
      sec = "0" + sec;
    }
    if (curSec < 10) {
      curSec = `0${curSec}`;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (curMin < 10) {
      curMin = `0${curMin}`;
    }

    const total_duration = `${min}:${sec}`;
    if (mAudio.duration) {
      end.innerHTML = `${total_duration}`;
    }
    start.innerHTML = `${curMin}:${curSec}`;
  }, 1000);
};

mAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;

  const progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
});

playPauseBtn.addEventListener("click", () => {
  if (playPauseBtn.classList.contains("paused")) {
    pauseMusic();
  } else {
    playMusic();
  }
});

nextBtn.addEventListener("click", () => {
  musicIndex++;
  if (musicIndex > musicAll.length - 1) {
    musicIndex = 0;
  }
  const currentMusic = musicAll[musicIndex];
  loadMusic(currentMusic);
  playMusic();
});

prevBtn.addEventListener("click", () => {
  musicIndex--;
  if (musicIndex < 0) {
    musicIndex = musicAll.length - 1;
  }
  const currentMusic = musicAll[musicIndex];
  loadMusic(currentMusic);
  playMusic();
});

progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffSetX = e.offsetX;
  let songDuration = mAudio.duration;

  mAudio.currentTime = (clickedOffSetX / progressWidth) * songDuration;
  playMusic();
});

// đăng ký 1 sợ kiện khi mà tất cả các tài nguyên được nạp vào thành công mới cho chạy code
window.addEventListener("load", () => {
  const currentMusic = musicAll[musicIndex];
  loadMusic(currentMusic);
  playingSong();
});

// open list menu
menulistBtn.addEventListener("click", () => musicList.classList.add("show"));
closeMusicBtn.addEventListener("click", () =>
  musicList.classList.remove("show")
);
