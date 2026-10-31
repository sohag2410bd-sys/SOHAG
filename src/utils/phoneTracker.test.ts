import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanPhoneString, parseNumberDetails, detectCarrier } from './phoneTracker';

test('cleanPhoneString formats various phone inputs properly', () => {
  assert.equal(cleanPhoneString('+880 1712-345678'), '+8801712345678');
  assert.equal(cleanPhoneString('008801712345678'), '+8801712345678');
  assert.equal(cleanPhoneString('01712345678', '+880'), '+8801712345678');
  assert.equal(cleanPhoneString('5551234567', '+1'), '+15551234567');
});

test('detectCarrier correctly identifies Bangladesh carriers', () => {
  assert.match(detectCarrier('BD', '1712345678'), /Grameenphone/i);
  assert.match(detectCarrier('BD', '1812345678'), /Robi/i);
  assert.match(detectCarrier('BD', '1912345678'), /Banglalink/i);
  assert.match(detectCarrier('BD', '1512345678'), /Teletalk/i);
  assert.match(detectCarrier('BD', '1612345678'), /Airtel/i);
});

test('parseNumberDetails parses and validates valid international phone numbers', () => {
  const result = parseNumberDetails('+8801712345678');
  assert.equal(result.success, true);
  assert.ok(result.data);
  assert.equal(result.data?.countryIso, 'BD');
  assert.equal(result.data?.countryCode, '+880');
  assert.equal(result.data?.isValid, true);
  assert.match(result.data?.carrier || '', /Grameenphone/i);
  assert.equal(result.data?.e164, '+8801712345678');
});

test('parseNumberDetails handles US numbers', () => {
  const result = parseNumberDetails('+12024561111'); // White house public line
  assert.equal(result.success, true);
  assert.ok(result.data);
  assert.equal(result.data?.countryIso, 'US');
  assert.equal(result.data?.countryCode, '+1');
  assert.equal(result.data?.isValid, true);
});

test('parseNumberDetails gracefully handles invalid or empty numbers', () => {
  const emptyRes = parseNumberDetails('');
  assert.equal(emptyRes.success, false);
  assert.ok(emptyRes.error);

  const invalidRes = parseNumberDetails('abc123');
  assert.equal(invalidRes.success, false);
});
