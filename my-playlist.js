const playbackNotice = document.querySelector('#playlist-play-notice');
document.querySelectorAll('[data-play]').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('#playlist-play-title').textContent = button.dataset.play === 'shuffle' ? '임의재생 안내' : '재생 안내';
  playbackNotice.showModal();
}));
