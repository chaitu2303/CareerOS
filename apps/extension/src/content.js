// Content Script for CareerOS Extension
console.log("CareerOS Content Script Loaded");

// Sensitive fields rules
const SENSITIVE_KEYWORDS = ['ssn', 'social security', 'password', 'credit card', 'ethnicity', 'disability'];

function isSensitiveField(inputElement) {
  const name = (inputElement.name || '').toLowerCase();
  const id = (inputElement.id || '').toLowerCase();
  return SENSITIVE_KEYWORDS.some(k => name.includes(k) || id.includes(k));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'DETECT_FIELDS') {
    const inputs = document.querySelectorAll('input, select, textarea');
    let safeFields = 0;
    inputs.forEach(input => {
      if (!isSensitiveField(input)) safeFields++;
    });
    sendResponse({ count: safeFields });
  }
});
