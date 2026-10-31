const bookmark = document.querySelector('#bookmark-artist');
bookmark.addEventListener('click', () => {
  bookmark.setAttribute('aria-pressed', String(bookmark.getAttribute('aria-pressed') !== 'true'));
});
document.querySelector('.profile-preview').addEventListener('click', () => {
  document.querySelector('#preview-notice').showModal();
});
