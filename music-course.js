const tabs = [...document.querySelectorAll('.course-tabs [role="tab"]')];
const rows = [...document.querySelectorAll('.course-row')];
const search = document.querySelector('.map-search input');
const panel = document.querySelector('#course-list');
let recommended = false;
function filterCourses() {
  const query = search.value.trim().toLocaleLowerCase();
  rows.forEach((row) => {
    row.hidden = (recommended && row.dataset.recommended !== 'true') || !row.querySelector('.course-copy').textContent.toLocaleLowerCase().includes(query);
  });
  document.querySelector('.course-empty').hidden = rows.some((row) => !row.hidden);
}
function selectTab(tab) {
  tabs.forEach((item) => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  recommended = tab.id === 'recommended-courses';
  panel.setAttribute('aria-labelledby', tab.id);
  filterCourses();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs[1] : tabs[1-index];
    selectTab(next); next.focus();
  });
});
search.addEventListener('input', filterCourses);
document.querySelector('.map-search').addEventListener('submit', (event) => { event.preventDefault(); filterCourses(); });
document.querySelectorAll('.map-filters button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.map-filters button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
}));
document.querySelectorAll('.course-menu').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('#course-notice-title').textContent = button.closest('.course-row').querySelector('h2').textContent;
  document.querySelector('#course-notice').showModal();
}));
