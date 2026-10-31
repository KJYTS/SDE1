const searchForm = document.querySelector('.map-search');
const searchInput = searchForm.querySelector('input');
const filters = document.querySelectorAll('.map-filters button');
const nodes = document.querySelectorAll('.map-node');
let activeFilter = 0;
function filterMap() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visible = 0;
  nodes.forEach((node) => {
    const matchesQuery = node.dataset.search.toLocaleLowerCase().includes(query);
    const matchesKind = activeFilter !== 1 || node.dataset.kind === 'song';
    node.hidden = !(matchesQuery && matchesKind);
    if (!node.hidden) visible++;
  });
  document.querySelector('.map-empty').hidden = visible > 0;
}
searchForm.addEventListener('submit', (event) => { event.preventDefault(); filterMap(); });
searchInput.addEventListener('input', filterMap);
filters.forEach((button, index) => button.addEventListener('click', () => {
  activeFilter = index;
  filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  filterMap();
}));
nodes.forEach((node) => {
  if (node.classList.contains('artist-han') || node.classList.contains('artist-luna')) return;
  node.addEventListener('click', () => {
    document.querySelector('#map-detail-title').textContent = node.dataset.search;
    document.querySelector('#map-detail').showModal();
  });
});
const phone = document.querySelector('.map-phone');
const hanButton = document.querySelector('.han-open');
const lunaButton = document.querySelector('.artist-luna');
const carousel = document.querySelector('.artist-cards');
const cards = [...carousel.querySelectorAll('.han-card')];
const hashes = ['#hanroro', '#kimluna'];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let settleTimer;
let resizeFrame;
let syncing = false;
function cardStep() {
  return cards[1].offsetLeft - cards[0].offsetLeft;
}
function updateCamera() {
  const step = cardStep();
  const progress = step ? Math.max(0, Math.min(1, carousel.scrollLeft / step)) : 0;
  phone.style.setProperty('--map-progress', progress);
}
function settleCard() {
  if (carousel.hidden || syncing || drag) return;
  const index = Math.round(carousel.scrollLeft / (cardStep() || 1));
  cards.forEach((card, i) => { card.inert = i !== index; });
  if (location.hash !== hashes[index]) history.replaceState(null, '', location.pathname + location.search + hashes[index]);
  document.querySelector('.artist-card-status').textContent = `${index + 1} / 2, ${index ? '김루나' : '한로로'}`;
}
function moveToCard(index, smooth = true) {
  carousel.scrollTo({ left: cardStep() * index, behavior: smooth && !reduceMotion.matches ? 'smooth' : 'instant' });
}
function syncArtistCard() {
  const index = hashes.indexOf(location.hash);
  const open = index !== -1;
  syncing = true;
  clearTimeout(settleTimer);
  phone.classList.toggle('han-selected', open);
  carousel.hidden = !open;
  hanButton.setAttribute('aria-expanded', String(open));
  if (open) {
    cards.forEach((card, i) => { card.inert = i !== index; });
    moveToCard(index, false);
    updateCamera();
    document.querySelector('.artist-card-status').textContent = `${index + 1} / 2, ${index ? '김루나' : '한로로'}`;
  } else {
    phone.style.setProperty('--map-progress', 0);
  }
  syncing = false;
}
function openCard(index) {
  if (location.hash === hashes[index]) { moveToCard(index); return; }
  location.hash = hashes[index];
}
hanButton.addEventListener('click', () => {
  if (location.hash === hashes[0]) {
    history.replaceState(null, '', location.pathname + location.search);
    syncArtistCard();
  } else openCard(0);
});
lunaButton.addEventListener('click', () => openCard(1));
carousel.addEventListener('scroll', () => {
  updateCamera();
  clearTimeout(settleTimer);
  settleTimer = setTimeout(settleCard, 160);
}, { passive: true });
carousel.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const index = event.key === 'ArrowRight' || event.key === 'End' ? 1 : 0;
  // Move focus out of a card before making that card inert.
  carousel.focus({ preventScroll: true });
  moveToCard(index);
});
// Touch uses native scrolling; pointer dragging adds the same gesture for a mouse.
let drag = null;
carousel.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button, a')) return;
  drag = { id: event.pointerId, x: event.clientX, left: carousel.scrollLeft, moved: false };
});
carousel.addEventListener('pointermove', (event) => {
  if (!drag || event.pointerId !== drag.id) return;
  const delta = event.clientX - drag.x;
  if (!drag.moved && Math.abs(delta) < 5) return;
  if (!drag.moved) {
    carousel.setPointerCapture(event.pointerId);
    carousel.classList.add('dragging');
    carousel.focus({ preventScroll: true });
    drag.moved = true;
  }
  carousel.scrollLeft = drag.left - delta;
});
function finishDrag(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const moved = drag.moved;
  const delta = event.clientX - drag.x;
  const start = Math.round(drag.left / (cardStep() || 1));
  drag = null;
  carousel.classList.remove('dragging');
  if (carousel.hasPointerCapture(event.pointerId)) carousel.releasePointerCapture(event.pointerId);
  if (moved) {
    const index = Math.abs(delta) > cardStep() * .15 ? (delta < 0 ? 1 : 0) : start;
    moveToCard(index);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settleCard, 500);
  }
}
carousel.addEventListener('pointerup', finishDrag);
carousel.addEventListener('pointercancel', finishDrag);
window.addEventListener('pointerup', finishDrag);
window.addEventListener('hashchange', syncArtistCard);
let lastCarouselWidth = carousel.clientWidth;
new ResizeObserver(([entry]) => {
  const width = entry.contentRect.width;
  if (!width || Math.abs(width - lastCarouselWidth) < 1) return;
  lastCarouselWidth = width;
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    if (!carousel.hidden && !drag) {
      moveToCard(Math.max(0, hashes.indexOf(location.hash)), false);
      updateCamera();
    }
  });
}).observe(carousel);
syncArtistCard();
