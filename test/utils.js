/**
 * @template {Object} T
 * @param {Tap.Test} t
 * @param {T} object
 * @param {(keyof T)[]} keys
 */
export function hasKeys(t, object, keys) {
  const objectKeys = Object.keys(object).sort();
  const expectedKeys = [keys].flat().sort();
  return t.same(objectKeys, expectedKeys);
}
