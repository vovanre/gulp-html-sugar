'use strict';

const
    through = require('through2'),
    cheerio = require('cheerio'),
    BufferStreams = require('bufferstreams'),
    PluginError = require('gulp-util').PluginError
;

const PLUGIN_NAME = 'gulp-html-sugar';

function processHtml(options, contents, callback) {
    const $ = cheerio.load(contents);

    Object.keys(options).forEach(function (key) {
        const template = options[key];
        const elements = $(key);
        if (elements.length === 0)
            return;

        if (typeof template === 'function') {
            elements.each(function () {
                template($, $(this));
            });
        } else {
            throw new Error('Invalid template type ' + typeof template + ' expect function');
        }
    });
    callback(new Buffer($.html()));
}

function gulpHtmlSugar(options) {
    options = options || {};

    return through.obj(function (file, enc, callback) {
        try {
            if (file.isNull()) {
                this.push(file);
                return callback();
            }

            const self = this;

            if (file.isStream()) {
                file.contents = file.contents.pipe(new BufferStreams(function (none, buffer, done) {
                    processHtml(options, String(buffer), function (contents) {
                        done(null, contents);

                        self.push(file);
                        callback();
                    });
                }));
            } else {
                processHtml(options, String(file.contents), function (contents) {
                    file.contents = contents;
                    self.push(file);
                    callback();
                });
            }
        } catch (err) {
            this.emit('error', new PluginError(PLUGIN_NAME, err));
        }
    });
}

module.exports = gulpHtmlSugar;
