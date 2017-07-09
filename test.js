'use strict';

const
    expect = require('chai').expect,
    File = require('vinyl'),
    htmlSugar = require('./index'),
    es = require('event-stream')
;

describe('gulp-html-sugar', function () {
    describe('should expand HTML sugar', function () {
        it('fragment in buffer mode', function (done) {
            const fakeFile = new File({
                contents: new Buffer('<icon>example-icon</icon>')
            });
            const sugarStream = htmlSugar({
                'icon': function ($, element) {
                    const name = element.html().trim();
                    expect(name).to.equal('example-icon');

                    element.replaceWith($(`<svg class="icon ${name}"><use xlink:href="sprite.svg#${name}"/></svg>`));
                }
            });

            sugarStream.write(fakeFile);

            sugarStream.once('data', function (file) {
                expect(file).to.not.equal(null);
                expect(file.isBuffer()).to.equal(true);

                expect(file.contents.toString('utf8')).to.equal('<svg class="icon example-icon"><use xlink:href="sprite.svg#example-icon"/></svg>');
                done();
            });
        });
        it('fragment in stream mode', function (done) {
            const fakeFile = new File({
                contents: es.readArray(['<icon>example-icon</icon>'])
            });
            const sugarStream = htmlSugar({
                'icon': function ($, element) {
                    const name = element.html().trim();
                    expect(name).to.equal('example-icon');

                    element.replaceWith($(`<svg class="icon ${name}"><use xlink:href="sprite.svg#${name}"/></svg>`));
                }
            });

            sugarStream.write(fakeFile);

            sugarStream.once('data', function (file) {
                expect(file).to.not.equal(null);
                expect(file.isStream()).to.equal(true);

                file.contents.pipe(es.wait(function (err, data) {
                    expect(String(data)).to.equal('<svg class="icon example-icon"><use xlink:href="sprite.svg#example-icon"/></svg>');
                    done();
                }));
            });
        });
        it('in buffer mode', function (done) {
            const fakeFile = new File({
                contents: new Buffer('<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <title>Example page<\/title>\r\n  <\/head>\r\n  <body>\r\n    <icon>trash<\/icon>\r\n  <\/body>\r\n<\/html>')
            });
            const sugarStream = htmlSugar({
                'icon': function ($, element) {
                    const name = element.html().trim();
                    expect(name).to.equal('trash');

                    element.replaceWith($(`<svg class="icon ${name}"><use xlink:href="sprite.svg#${name}"/></svg>`));
                }
            });

            sugarStream.write(fakeFile);

            sugarStream.once('data', function (file) {
                expect(file).to.not.equal(null);
                expect(file.isBuffer()).to.equal(true);

                expect(file.contents.toString('utf8')).to.equal('<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <title>Example page<\/title>\r\n  <\/head>\r\n  <body>\r\n    <svg class=\"icon trash\"><use xlink:href=\"sprite.svg#trash\"\/><\/svg>\r\n  <\/body>\r\n<\/html>');
                done();
            });
        });
        it('in stream mode', function (done) {
            const fakeFile = new File({
                contents: es.readArray(['<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <title>Example page<\/title>\r\n  <\/head>\r\n  <body>\r\n    <icon>trash<\/icon>\r\n  <\/body>\r\n<\/html>'])
            });
            const sugarStream = htmlSugar({
                'icon': function ($, element) {
                    const name = element.html().trim();
                    expect(name).to.equal('trash');

                    element.replaceWith($(`<svg class="icon ${name}"><use xlink:href="sprite.svg#${name}"/></svg>`));
                }
            });

            sugarStream.write(fakeFile);

            sugarStream.once('data', function (file) {
                expect(file).to.not.equal(null);
                expect(file.isStream()).to.equal(true);

                file.contents.pipe(es.wait(function (err, data) {
                    expect(String(data)).to.equal('<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\">\r\n    <title>Example page<\/title>\r\n  <\/head>\r\n  <body>\r\n    <svg class=\"icon trash\"><use xlink:href=\"sprite.svg#trash\"\/><\/svg>\r\n  <\/body>\r\n<\/html>');
                    done();
                }));
            });
        });
    });
});