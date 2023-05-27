import postcss from 'postcss';
import { test } from 'tap';

import DoIUse from '../../lib/DoIUse.js';

test('partial support flags unsupported key: value pairs', async (t) => {
  const css = '.test {appearance: auto; }';
  let featureCount = 0;

  await postcss(new DoIUse({
    browsers: ['chrome 81'],
    onFeatureUsage: (usageinfo) => {
      const messageWithoutFile = usageinfo.message.replace(/<.*>/, '');
      t.equal(messageWithoutFile, ':1:8: CSS Appearance appearance: auto is not supported by chrome 81 (css-appearance)');
      featureCount += 1;
    },
  })).process(css);

  // make sure onFeatureUsage was called
  t.equal(featureCount, 1);
});

test('partial support does not flag supported key: value pairs', async (t) => {
  const css = '.test { appearance: none; }';
  let featureCount = 0;

  await postcss(new DoIUse({
    browsers: ['chrome 81'],
    onFeatureUsage: () => {
      featureCount += 1;
    },
  })).process(css);

  // make sure onFeatureUsage was called
  t.equal(featureCount, 0);
});

test('partial support does not flag formerly unsupported key: value pairs', async (t) => {
  const css = '.test { appearance: auto; }';
  let featureCount = 0;

  await postcss(new DoIUse({
    browsers: ['chrome 83'],
    onFeatureUsage: () => {
      featureCount += 1;
    },
  })).process(css);

  // make sure onFeatureUsage was called
  t.equal(featureCount, 0);
});
