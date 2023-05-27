import postcss from 'postcss';
import { test } from 'tap';

import DoIUse from '../../lib/DoIUse.js';

// tests for https://github.com/anandthakker/doiuse/issues/70

test('partial support does not flag outline in ie 11', async (t) => {
  const css = '.test { outline: 1px solid black; }';
  let featureCount = 0;

  await postcss(new DoIUse({
    browsers: ['ie 11'],
    onFeatureUsage: () => {
      featureCount += 1;
    },
  })).process(css);

  // make sure onFeatureUsage was called
  t.equal(featureCount, 0);
});

test('partial support does flag outline-offset in ie 11', async (t) => {
  const css = '.test { outline-offset: 1px; }';
  let featureCount = 0;

  await postcss(new DoIUse({
    browsers: ['ie 11'],
    onFeatureUsage: (usageinfo) => {
      const messageWithoutFile = usageinfo.message.replace(/<.*>/, '');
      t.equal(messageWithoutFile, ':1:9: CSS outline properties outline-offset is not supported by: IE (11) (outline)');
      featureCount += 1;
    },
  })).process(css);

  // make sure onFeatureUsage was called
  t.equal(featureCount, 1);
});
