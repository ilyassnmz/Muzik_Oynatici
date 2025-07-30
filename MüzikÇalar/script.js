// Elementler
const music = document.querySelector('audio');
const image = document.querySelector('.imgDiv img');
const playButton = document.getElementById('play');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const likeButton = document.getElementById('likeBtn');

const title = document.getElementById('title');
const creator = document.getElementById('creator');
const progressDiv = document.getElementById('progressDiv');
const progress = document.getElementById('progress');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');

const playlistEl = document.getElementById('playlist');
const volumeSlider = document.getElementById('volume');

let songIndex = 0;
let isPlaying = false;

// LocalStorage favoriler
const LS_KEY = 'favorites';
let favorites = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

// Şarkı listesi
const songs = [
  { id: 'kenan', file: 'KenanDogulu.mp3', img: 'Kenan.jpg', title: 'Ara Beni Lütfen', creator: 'Kenan Doğulu' },
  { id: 'demet', file: 'DemetAkalın.mp3', img: 'Demet.jpg', title: 'Nazar', creator: 'Demet Akalın' },
  { id: 'merve', file: 'Merve.mp3', img: 'Merve.jpg', title: 'Kendine Dünya', creator: 'Merve' },
  { id: 'normxebru', file: 'NormXEbru.mp3', img: 'EbruxNorm.jpg', title: 'Bir Çift Göz', creator: 'Norm X Ebru' },
  { id: 'sebnem', file: 'Sebnem.mp3', img: 'Sebnem.jpg', title: 'Bu Aşk Fazla Sana', creator: 'Şebnem' },
  { id: 'semicenk', file: 'Semicenk.mp3', img: 'Semicenk.jpg', title: 'Kalpsiz', creator: 'Semicenk' },
  { id: 'zeynep', file: 'Zeynep.mp3', img: 'Zeynep.jpg', title: 'Kör Sevdam', creator: 'Zeynep' },
];

// ------- Yardımcılar -------
function saveFavorites() {
  localStorage.setItem(LS_KEY, JSON.stringify(favorites));
}

function isFav(id) {
  return favorites.includes(id);
}

function setLikeState() {
  const icon = likeButton.querySelector('i');
  if (isFav(songs[songIndex].id)) {
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid');
    likeButton.classList.add('liked');
  } else {
    icon.classList.add('fa-regular');
    icon.classList.remove('fa-solid');
    likeButton.classList.remove('liked');
  }
}

function toggleLike() {
  const id = songs[songIndex].id;
  if (isFav(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites();
  setLikeState();
  renderPlaylist(); // Favori işaretini listede güncelle
}

// ------- Şarkı Yükleme / Oynatma Kontrolleri -------
function loadSong(song) {
  title.textContent = song.title;
  creator.textContent = song.creator;
  music.src = `music/${song.file}`;
  image.src = `img/${song.img}`;
  totalTimeSpan.textContent = '0:00';
  currentTimeSpan.textContent = '0:00';
  highlightActiveSong();
  setLikeState();
}

function playSong() {
  isPlaying = true;
  playButton.classList.replace('fa-play', 'fa-pause');
  music.play();
}

function pauseSong() {
  isPlaying = false;
  playButton.classList.replace('fa-pause', 'fa-play');
  music.pause();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

// ------- İlerleme Çubuğu -------
function updateProgressBar(e) {
  if (!isPlaying) return;
  const { currentTime, duration } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  if (!isNaN(duration)) {
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    totalTimeSpan.textContent = `${durationMinutes}:${durationSeconds}`;
  }

  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
  currentTimeSpan.textContent = `${currentMinutes}:${currentSeconds}`;
}

function setProgressBar(e) {
  const width = e.currentTarget.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
}

function renderPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, i) => {
    const li = document.createElement('li');
    li.dataset.index = i;
    li.className = i === songIndex ? 'active' : '';
    li.innerHTML = `
      <span class="songTitle">${song.title} - <span class="songCreator">${song.creator}</span></span>
      <span class="favMark ${isFav(song.id) ? 'on' : ''}">
        <i class="${isFav(song.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </span>
    `;
    playlistEl.appendChild(li);
  });
}

function highlightActiveSong() {
  [...playlistEl.children].forEach((li) => li.classList.remove('active'));
  const currentLi = playlistEl.children[songIndex];
  if (currentLi) currentLi.classList.add('active');
}
function onVolumeChange(e) {
  music.volume = e.target.value;
}
playButton.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevButton.addEventListener('click', prevSong);
nextButton.addEventListener('click', nextSong);
likeButton.addEventListener('click', toggleLike);
music.addEventListener('timeupdate', updateProgressBar);
music.addEventListener('ended', nextSong);
progressDiv.addEventListener('click', setProgressBar);
volumeSlider.addEventListener('input', onVolumeChange);
music.addEventListener('loadedmetadata', () => {
  const duration = music.duration;
  if (!isNaN(duration)) {
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    totalTimeSpan.textContent = `${durationMinutes}:${durationSeconds}`;
  }
});
playlistEl.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  songIndex = Number(li.dataset.index);
  loadSong(songs[songIndex]);
  playSong();
});
loadSong(songs[songIndex]);
renderPlaylist();
