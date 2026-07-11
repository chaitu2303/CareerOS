document.addEventListener('DOMContentLoaded', async () => {
  const status = document.getElementById('auth-status');
  const btnDetect = document.getElementById('btn-detect');
  const btnAutofill = document.getElementById('btn-autofill');
  const btnUndo = document.getElementById('btn-undo');

  // Mock Authentication Check
  status.textContent = 'Authenticated as Beta User';
  status.style.color = 'green';
  btnDetect.disabled = false;

  btnDetect.addEventListener('click', () => {
    btnDetect.textContent = 'Detected 12 Fields';
    btnAutofill.disabled = false;
  });

  btnAutofill.addEventListener('click', () => {
    btnAutofill.textContent = 'Filled Successfully';
    btnAutofill.disabled = true;
    btnUndo.disabled = false;
  });

  btnUndo.addEventListener('click', () => {
    btnAutofill.textContent = 'Auto-fill Safe Fields';
    btnAutofill.disabled = false;
    btnUndo.disabled = true;
  });
});
