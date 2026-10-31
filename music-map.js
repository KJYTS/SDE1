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
nodes.forEach((node) => node.addEventListener('click', () => {
  document.querySelector('#map-detail-title').textContent = node.dataset.search;
  document.querySelector('#map-detail').showModal();
}));
