import { expect } from 'chai';
import { sumAssetSizes } from '../lib/helpers.js';

describe('sumAssetSizes', function () {
  it('sums the total sizes for each file type', function() {
    const assetSizeReport = {
      'ember-website.js': { raw: 1000, gzip: 10, brotli: null },
      'vendor.js': { raw: 1000, gzip: 10, brotli: null },
      'ember-website.css': { raw: 1000, gzip: 10, brotli: null },
      'vendor.css': { raw: 1000, gzip: 10, brotli: null },
    };

    const summedAssetSizes = sumAssetSizes(assetSizeReport);

    expect(summedAssetSizes).to.deep.equal({
      css: {
        raw: 2000,
        gzip: 20,
      },
      js: {
        raw: 2000,
        gzip: 20,
      },
    });
  });
});
