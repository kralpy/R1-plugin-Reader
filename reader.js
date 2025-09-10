let pdfPages = [];
let currentPage = 0;
const pdfPageEl = document.getElementById('pdfPage');
const pageNumberEl = document.getElementById('pageNumber');
const pdfInputContainer = document.getElementById('pdfInputContainer');
const pdfUrlInput = document.getElementById('pdfUrlInput');
const pdfUrlAddBtn = document.getElementById('pdfUrlAddBtn');

// Load saved state
async function loadState() {
  const saved = await window.creationStorage.plain.getItem('readerState');
  if (saved) {
    const state = JSON.parse(atob(saved));
    pdfPages = state.pdfPages || [];
    currentPage = state.currentPage || 0;
    renderPage();
  }
}

// Save current state
async function saveState() {
  const state = { pdfPages, currentPage };
  await window.creationStorage.plain.setItem('readerState', btoa(JSON.stringify(state)));
}

// Render current page
function renderPage() {
  if (pdfPages.length === 0) {
    pdfPageEl.src = '';
    pageNumberEl.textContent = `0 / 0`;
    return;
  }
  pdfPageEl.src = pdfPages[currentPage];
  pageNumberEl.textContent = `${currentPage + 1} / ${pdfPages.length}`;
  saveState();
}

// Navigation
function nextPage() {
  if (currentPage < pdfPages.length - 1) currentPage++;
  renderPage();
}
function prevPage() {
  if (currentPage > 0) currentPage--;
  renderPage();
}

// Event listeners
document.getElementById('nextPage').addEventListener('click', nextPage);
document.getElementById('prevPage').addEventListener('click', prevPage);

// Show input bar when + is clicked
document.getElementById('addPdf').addEventListener('click', () => {
  pdfInputContainer.style.display = 'flex';
  pdfUrlInput.focus();
});

// Add PDF URL when OK is clicked
pdfUrlAddBtn.addEventListener('click', () => {
  const url = pdfUrlInput.value.trim();
  if (url) {
    pdfPages.push(url);
    currentPage = pdfPages.length - 1;
    renderPage();
    pdfUrlInput.value = '';
    pdfInputContainer.style.display = 'none';
  }
});

// Hardware button support
window.addEventListener('scrollUp', prevPage);
window.addEventListener('scrollDown', nextPage);
window.addEventListener('sideClick', nextPage);

// PC testing
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') prevPage();
  if (e.key === 'ArrowDown') nextPage();
  if (e.key === 'Enter') nextPage();
});

// Initialize
loadState();
