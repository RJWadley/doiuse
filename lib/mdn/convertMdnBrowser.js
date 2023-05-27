/**
 * @typedef {Record<string, {
 *   versionAdded: number;
 *   versionRemoved?: number;
 * }>} MdnSupportData
 */

/**
 * converts browser names from MDN to caniuse
 * @param {string} browser
 */
function convertMdnBrowser(browser) {
  if (browser === 'samsunginternet_android') {
    return 'samsung';
  } if (browser === 'safari_ios') {
    return 'ios_saf';
  } if (browser === 'opera_android') {
    return 'op_mob';
  } if (browser === 'chrome_android') {
    return 'and_chr';
  } if (browser === 'firefox_android') {
    return 'and_ff';
  } if (browser === 'webview_android') {
    return 'android';
  }

  return browser;
}

/**
 *
 * @param {string|true} version the version string from MDN
 * @return {number} as a number
 */
function mdnVersionToNumber(version) {
  // sometimes the version is 'true', which means support is old
  if (version === true) {
    return 0;
  }

  return Number.parseFloat(version);
}

/**
 *
 * convert raw MDN data to a format the uses caniuse browser names and real numbers
 * @param {import("@mdn/browser-compat-data").SupportBlock} supportData
 * @return {MdnSupportData} browsers
 */
export function convertMdnSupportToBrowsers(supportData) {
  /**
   * @type {MdnSupportData}
   */
  const browsers = {};

  Object.entries(supportData).forEach(([browser, data]) => {
    const caniuseBrowser = convertMdnBrowser(browser);

    if (Array.isArray(data)) {
      // TODO: handle arrays (used to give information about prefixes and alternative syntaxes)
      return;
    }

    if (data.version_added) {
      browsers[caniuseBrowser] = {
        versionAdded: mdnVersionToNumber(data.version_added),
      };
    }

    if (data.version_removed) {
      browsers[caniuseBrowser].versionRemoved = mdnVersionToNumber(data.version_removed);
    }
  });

  return browsers;
}
