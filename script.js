var swiper = new Swiper("#swiper-container-1", {
  speed: 1000,
  loop: false,
  grabCursor: true,
  effect: "creative",
  creativeEffect: {
    prev: {
      shadow: true,
      translate: ["-120%", 0, -500],
    },
    next: {
      shadow: true,
      translate: ["120%", 0, -500],
    },
  },
  autoplay: {
    delay: 4000,
    reverseDirection: false,
    disableOnInteraction: false,
  },
  on: {
    reachEnd: function () {
      swiper.autoplay.stop();
      // tunggu 3 detik
      setTimeout(function () {
        const container = document.getElementById("swiper-container-1");
        container.classList.add("fade-out");

        setTimeout(function () {
          container.style.display = "none";

          // Setelah selesai, munculkan swiper ke-2
          const container2 = document.getElementById("swiper-container-2");
          container2.style.display = "block";
          setTimeout(function () {
            container2.classList.add("fade-in");
          }, 50); // kecil delay biar transition bisa kebaca browser

          // Inisialisasi swiper kedua setelah tampil
          new Swiper("#swiper-container-2", {
            speed: 1500,
            loop: false,
            grabCursor: true,
            effect: "fade", // <-- Ganti effect ke fade
            fadeEffect: {
              crossFade: true, // biar transisinya smooth
            },
            autoplay: {
              delay: 1000,
              reverseDirection: false,
              disableOnInteraction: false,
            },
            on: {
              reachEnd: function () {
                this.autoplay.stop();
              },
            },
          });
        }, 1000);
      }, 3000);
    },
  },
});

//player
const playlist = [
  {
    title: "Kaktus",
    artist: "Suara Kayu",
    cover: "kaktus.png",
    src: "kaktus.mp3",
  },
  {
    title: "UWU",
    artist: "Suara Kayu",
    cover: "uwu.png",
    src: "uwu.mp3",
  },
];

let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;

const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const progressBar = document.getElementById("progress-bar");
const progressFilled = document.getElementById("progress-filled");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const coverEl = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const volumeEl = document.getElementById("volume");

function loadSong(index) {
  const song = playlist[index];
  audio.src = song.src;
  coverEl.src = song.cover;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

function updateProgress() {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);
  const percent = (audio.currentTime / audio.duration) * 100;
  progressFilled.style.width = percent + "%";
}

function playSong() {
  audio.play();
  playPauseBtn.innerHTML = '<i class="fas fa-pause-circle"></i>';
}

function pauseSong() {
  audio.pause();
  playPauseBtn.innerHTML = '<i class="fas fa-play-circle"></i>';
}

function nextSong() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentIndex = (currentIndex + 1) % playlist.length;
  }
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  playSong();
}

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) playSong();
  else pauseSong();
});

audio.addEventListener("loadedmetadata", () => updateProgress());
audio.addEventListener("timeupdate", () => updateProgress());

audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSong();
  } else {
    nextSong();
  }
});

document.getElementById("next").addEventListener("click", nextSong);
document.getElementById("prev").addEventListener("click", prevSong);
document.getElementById("shuffle").addEventListener("click", () => {
  isShuffle = !isShuffle;
  document.getElementById("shuffle").style.color = isShuffle
    ? "#1DB954"
    : "#fff";
});
document.getElementById("repeat").addEventListener("click", () => {
  isRepeat = !isRepeat;
  document.getElementById("repeat").style.color = isRepeat ? "#1DB954" : "#fff";
});

// Seekable progress bar
let isDragging = false;
function seek(e) {
  const rect = progressBar.getBoundingClientRect();
  let x = e.clientX ?? e.touches[0].clientX;
  const offsetX = x - rect.left;
  const width = rect.width;
  const percent = Math.max(0, Math.min(1, offsetX / width));
  audio.currentTime = percent * audio.duration;
}

progressBar.addEventListener("mousedown", (e) => {
  isDragging = true;
  seek(e);
});
document.addEventListener("mousemove", (e) => {
  if (isDragging) seek(e);
});
document.addEventListener("mouseup", () => {
  isDragging = false;
});

progressBar.addEventListener("touchstart", (e) => {
  isDragging = true;
  seek(e);
});
progressBar.addEventListener("touchmove", (e) => {
  if (isDragging) seek(e);
});
progressBar.addEventListener("touchend", () => {
  isDragging = false;
});
// Tambahkan listener click
progressBar.addEventListener("click", function (e) {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const barWidth = rect.width;
  const duration = audio.duration;

  audio.currentTime = (clickX / barWidth) * duration;
});

volumeEl.addEventListener("input", () => {
  audio.volume = volumeEl.value;
});

//lyrics
const songs = [
  {
    title: "UWU",
    artist: "Suara Kayu",
    audio: "uwu.mp3",
    cover: "uwu.png",
    lyrics: [
      { time: 0, text: "🎶" },
      { time: 9, text: "Kulihat foto uwu kita berdua" },
      { time: 17.8, text: "Tertawa melihat tingkah lucumu itu" },
      { time: 26.5, text: "Dari kamu kurus sampai gendut" },
      { time: 31, text: "Kar'na hobimu makan mi instan" },
      { time: 39, text: "Tak apa perutmu buncit" },
      { time: 43.5, text: "Itu bentuk bahagia" },
      { time: 48, text: "Aku bukannya si bucin" },
      { time: 52, text: "Untukku, kamu sempurna" },
      { time: 56, text: "Ku berdoa cinta kita untuk selamanya" },
      { time: 65, text: "Kar'na tak ada kata bahagia" },
      { time: 70, text: "Tanpa kamu di sampingku" },
      { time: 74, text: "UWU" },
      { time: 76, text: "🎶" },
      { time: 82.9, text: "Kulihat foto uwu kita berdua" },
      { time: 91.8, text: "Tertawa melihat tingkah lucumu itu" },
      { time: 100, text: "Dari kamu kurus sampai gendut" },
      { time: 104.5, text: "Kar'na hobimu makan indomie atau mie sedap🤣" },
      { time: 112, text: "Tak apa perutmu buncit" },
      { time: 117, text: "Itu bentuk bahagia" },
      { time: 121, text: "Aku bukannya si bucin" },
      { time: 127, text: "Untukku, kamu sempurna" },
      { time: 131, text: "Ku berdoa cinta kita untuk selamanya" },
      { time: 140, text: "Kar'na tak ada kata bahagia" },
      { time: 144.5, text: "Tanpa kamu di sampingku" },
      { time: 148, text: "UWU" },
      { time: 158, text: "Kamu bertanya" },
      { time: 162, text: "Akankah kutinggalkanmu" },
      { time: 167, text: "Aku menjawab" },
      { time: 170, text: "I love you full" },
      { time: 173, text: "UWU" },
      { time: 182, text: "Tararara ra rara rararara raaaa ra" },
      { time: 191, text: "Tak apa perutmu buncit" },
      { time: 195, text: "Itu bentuk bahagia" },
      { time: 199, text: "Aku bukannya si bucin" },
      { time: 203, text: "Untukku, kamu sempurna" },
      { time: 208, text: "Ku berdoa cinta kita untuk selamanya" },
      { time: 216, text: "Kar'na tak ada kata bahagia" },
      { time: 221, text: "Tanpa kamu di sampingku" },
      { time: 224.8, text: "UWU" },
    ],
  },
  {
    title: "Kaktus",
    artist: "Suara Kayu",
    audio: "kaktus.mp3",
    cover: "kaktus.png",
    lyrics: [
      { time: 1, text: "Kakak Adik Tanpa Status" },
      { time: 9, text: "Kita sudah Kenal lama" },
      { time: 13, text: "Seperti kakak adik" },
      { time: 17, text: "Apakah kita hanya segini saja?" },
      { time: 25, text: "Aku ingin buat kamu tertawa bersamaku" },
      { time: 32, text: "Karena kata mereka" }, // Ini sepertinya bagian chorus yang seharusnya muncul di sini secara kronologis
      { time: 35, text: "Ketawa bisa bikin sayang" },
      { time: 39, text: "Tapi apa yang telah terjadi" },
      { time: 43, text: "Lihat tawamu, ku yang menjadi" }, // Timestamp ini ada di antara 36 dan 41, jadi saya letakkan di sini.
      { time: 49, text: "Sayang kepadamu" },
      { time: 53, text: "Ikan apa yang terindah?" },
      { time: 56, text: "Ikannot live without you in my life" }, // Ini ada di gambar, saya letakkan di sini
      { time: 60, text: "Ayam apa yang termanis?" }, // Terjadi setelah 48
      { time: 64, text: "Ayam falling in love with you" },
      { time: 68, text: "Aku ingin kamu tahu semua rasaku kepadamu" },
      { time: 76, text: "Ku tak ingin menjadi kaktus" }, // Ini muncul setelah 58, mungkin pengulangan atau penutup chorus
      { time: 80, text: "Kakak adik tanpa status" },
      { time: 89, text: "Aku ingin buat kamu tertawa bersamaku" },
      { time: 95.8, text: "Karena kata mereka ketawa bisa bikin sayang" },
      { time: 102, text: "Tapi apa yang telah terjadi" },
      { time: 107, text: "Lihat tawamu, ku yang menjadi" },
      { time: 112, text: "Sayang kepadamu" },
      { time: 117, text: "Ikan apa yang terindah?" },
      { time: 120, text: "Ikannot live without you in my life" }, // Ini ada di gambar, saya letakkan di sini
      { time: 124, text: "Ayam apa yang termanis?" }, // Terjadi setelah 48
      { time: 128, text: "Ayam falling in love with you" },
      { time: 132, text: "Aku ingin kamu tahu semua rasaku kepadamu" },
      { time: 140, text: "Ku tak ingin menjadi kaktus" }, // Ini muncul setelah 58, mungkin pengulangan atau penutup chorus
      { time: 144, text: "Kakak adik tanpa" },
      { time: 148, text: "Ku tak ingin menjadi kaktus" }, // Ini muncul setelah 58, mungkin pengulangan atau penutup chorus
      { time: 151.8, text: "Kakak adik tanpa status" },
    ],
  },
];

let currentSong = 0;
const lyricsContainer = document.getElementById("lyrics");

function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.audio;
  cover.src = song.cover;
  lyricsContainer.innerHTML = "";
  song.lyrics.forEach((line) => {
    const p = document.createElement("p");
    p.dataset.time = line.time;
    p.textContent = line.text;
    lyricsContainer.appendChild(p);
  });
}

loadSong(currentSong);

audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const lines = lyricsContainer.querySelectorAll("p");
  let activeLine = null;

  lines.forEach((line) => {
    let lineTime = parseFloat(line.dataset.time);
    if (currentTime >= lineTime) {
      activeLine = line;
    }
  });

  lines.forEach((line) => line.classList.remove("active"));
  if (activeLine) {
    activeLine.classList.add("active");
    activeLine.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

// Initial load
loadSong(currentIndex);
