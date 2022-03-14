import { agents } from 'caniuse-lite';

/** @typedef {RegExp|string|((value:string) => boolean)} FeatureCheck */

/**
 * @param {string} browserKey
 * @param {string[]} [versions]
 * @return {string}
 */
export function formatBrowserName(browserKey, versions) {
  const entry = agents[browserKey];
  const browserName = entry ? entry.browser : null;
  if (!versions) {
    return browserName || '';
  }
  return (`${browserName} (${versions.join(',')})`);
}

/**
 *
 * @param {FeatureCheck|FeatureCheck[]} check
 * @param {?string|undefined} candidate
 */
export function performFeatureCheck(check, candidate) {
  if (check == null || candidate == null) return false;
  if (check instanceof RegExp) {
    return check.test(candidate);
  }
  switch (typeof check) {
    case 'string':
      return candidate.includes(check);
    case 'function':
      return check(candidate);
    case 'boolean':
      return check;
    case 'object':
      if (Array.isArray(check)) {
        return check.some((c) => performFeatureCheck(c, candidate));
      }
      // Fallthrough
    default:
      console.error(check);
      throw new TypeError(`Unexpected feature check: ${check}`);
  }
}

/**
 * @param {FeatureCheck|FeatureCheck[]} selector
 * @return {(rule:import('postcss').ChildNode) => boolean}
 */
export function checkSelector(selector) {
  // @ts-ignore rule.selector can be `undefined`
  return (rule) => performFeatureCheck(selector, rule.selector);
}

/**
 * @param {FeatureCheck|FeatureCheck[]} [name]
 * @param {FeatureCheck|FeatureCheck[]} [params]
 * @return {(rule:import('postcss').ChildNode) => boolean}
 */
export function checkAtRule(name, params) {
  // @ts-ignore rule.name can be `undefined`
  return (rule) => performFeatureCheck(name, rule.name)
    // @ts-ignore rule.params can be `undefined`
    && (!params || performFeatureCheck(params, rule.params));
}
