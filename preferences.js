const keywords = document.querySelectorAll('.keyword');
const nextButton = document.querySelector('.preferences-next');

function updateNextButton() {
  nextButton.disabled = !Array.from(keywords).some((button) => button.getAttribute('aria-pressed') === 'true');
}

keywords.forEach((button) => {
  const removeIcon = document.createElement('span');
  removeIcon.className = 'keyword-remove';
  removeIcon.setAttribute('aria-hidden', 'true');
  button.append(removeIcon);
  button.addEventListener('click', () => {
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    updateNextButton();
  });
});
updateNextButton();

nextButton.addEventListener('click', () => {
  if (!nextButton.disabled && nextButton.dataset.next) {
    window.location.href = nextButton.dataset.next;
  }
});
