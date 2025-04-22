// popup/popup.js

/**
 * Renders deal cards or error messages when the background
 * service worker sends SHOW_RESULTS or SHOW_ERROR.
 */

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'SHOW_RESULTS') {
      displayResults(message.payload.matches);
    } else if (message.action === 'SHOW_ERROR') {
      displayError(message.payload.message);
    }
  });
  
  function displayResults(matches) {
    const container = document.getElementById('results');
    container.innerHTML = '';  // clear any previous content
  
    if (!matches.length) {
      container.textContent = 'No deals found.';
      return;
    }
  
    matches.forEach(match => {
      const card = document.createElement('div');
      card.className = 'deal-card';
      card.innerHTML = `
        <img src="${match.imageUrl}" alt="${match.name}">
        <div class="info">
          <h2>${match.name}${match.vintage ? ` (${match.vintage})` : ''}</h2>
          <p>Retail: $${match.sourcePrice.toFixed(2)}</p>
          <p>BAXUS: $${match.matchPrice.toFixed(2)} <span class="savings">Save ${match.savingsPct}%</span></p>
          <a href="https://baxus.co/listing/${match.id}" target="_blank">View on BAXUS</a>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  function displayError(msg) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = `Error: ${msg}`;
  }
  