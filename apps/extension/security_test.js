const assert = require('assert');

// Mock content script logic
const SENSITIVE_KEYWORDS = [
  'ssn', 'social security', 'password', 'credit card', 'ethnicity', 
  'disability', 'veteran', 'gender', 'race', 'visa', 'sponsorship'
];

function isSensitiveField(inputElement) {
  const name = (inputElement.name || '').toLowerCase();
  const id = (inputElement.id || '').toLowerCase();
  const label = (inputElement.labels && inputElement.labels.length > 0) 
    ? inputElement.labels[0].innerText.toLowerCase() 
    : '';
  
  const textToScan = `${name} ${id} ${label}`;
  return SENSITIVE_KEYWORDS.some(k => textToScan.includes(k));
}

function runTests() {
  console.log("Running Security Classification Tests...");

  // 1. Valid Autofill Fields
  assert.strictEqual(isSensitiveField({ name: 'firstName', id: 'first_name' }), false, 'First name is not sensitive');
  assert.strictEqual(isSensitiveField({ name: 'email', id: 'user_email' }), false, 'Email is not sensitive');
  
  // 2. Sensitive Fields
  assert.strictEqual(isSensitiveField({ name: 'ssn', id: 'social_security' }), true, 'SSN is sensitive');
  assert.strictEqual(isSensitiveField({ name: 'applicant_race', id: 'race' }), true, 'Race is sensitive');
  assert.strictEqual(isSensitiveField({ name: '', id: 'q_ethnicity' }), true, 'Ethnicity is sensitive');
  
  // 3. Label text sensitivity
  assert.strictEqual(isSensitiveField({ 
    name: 'custom_123', 
    id: 'field_456', 
    labels: [{ innerText: 'Do you require visa sponsorship?' }] 
  }), true, 'Visa sponsorship in label is sensitive');

  console.log("All security tests passed!");
}

runTests();
