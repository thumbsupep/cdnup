'use strict';

/* eslint max-nested-callbacks: 0 */
/* eslint no-invalid-this: 0 */

describe('cdnup', function () {

  var assume = require('assume');
  var CDNUp = require('..');
  var resolve = require('url').resolve;
  var fixture = require('path').resolve(__dirname, 'fixture.js');
  //
  // TODO: Make this a private encrypted config on travis with an s3 bucket so
  // we can run tests
  //
  var config = require('./config');
  var root = 'cdnup';
  //
  // Define a local var so we override it.
  //
  var cdnup;

  //
  // Mounting a drive, can take really long depending on your geographical
  // location.
  //
  this.timeout(60000);

  beforeEach(function () {
    cdnup = new CDNUp(root, config);
  });


  it('exports as a function', function () {
    assume(CDNUp).is.a('function');
  });

  describe('#init', function () {
    it('inits the bucket', function (next) {
      cdnup.init(function (err) {
        if (err) return next(err);
        next();
      });
    });
  });

  describe('#upload', function () {
    it('creates a connection with the server', function (next) {
      var name = 'uploaded-fixture.js';
      cdnup.upload(fixture, name, function (err) {
        if (err) return next(err);

        cdnup.client.getFiles(cdnup.bucket, (err, files) => {
          if (err) return next(err);
          var filtered = files.filter(f => f.name === name);
          assume(filtered.length).equals(1);
          next();
        });
      });
    });

    it('uploads fixture with path in fixture name', function (next) {
      var name = 'fingerprint/uploaded-fixture.js';
      cdnup.upload(fixture, name, function (err) {
        if (err) return next(err);

        cdnup.client.getFiles(cdnup.bucket, (err, files) => {
          if (err) return next(err);
          var filtered = files.filter(f => f.name === name);
          assume(filtered.length).equals(1);
          next();
        });
      });
    });

    it('returns a url with the location of the file', function (next) {
      cdnup.upload(fixture, 'hello-fixture.js', function (err, url) {
        if (err) return next(err);

        assume(url).equals(resolve(cdnup.url(), 'hello-fixture.js'));
        next();
      });
    });
  });
});
