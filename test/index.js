// Load modules

var Code = require('code');
var Hapi = require('hapi');
var HapiDust = require('..');
var Hoek = require('hoek');
var Lab = require('lab');
var Vision = require('vision');

// Declare internals

var internals = {};

// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('Engine', function () {

    it('is an object', function (done) {

        expect(HapiDust).to.be.an.object();
        done();
    });

    it('has a compile method', function (done) {

        expect(HapiDust.module.compile).to.be.an.function();
        done();
    });

    it('has as prepare method', function (done) {

        expect(HapiDust.module.prepare).to.be.a.function();
        done();
    });

    it('has as registerPartial method', function (done) {

        expect(HapiDust.module.registerPartial).to.be.a.function();
        done();
    });

    it('has as registerHelper method', function (done) {

        expect(HapiDust.module.registerHelper).to.be.a.function();
        done();
    });

});

describe('compile()', function () {

    it('returns a function to the callback', function (done) {

        var callback = function (err, cb) {

            expect(cb).to.be.a.function();
            done();
        };

        HapiDust.module.compile('', {}, callback);
    });

});

describe('prepare()', function () {

    it('returns an error if compileMode is not async', function (done) {

        HapiDust.module.prepare({ compileMode: 'sync' }, function (err) {

            expect(err).to.be.an.object();
            done();
        });
    });

});

describe('registerPartial()', function () {

    it('exits silenty', function (done) {

        var err;

        try {
            var ret = HapiDust.module.registerPartial('test-template', 'Hello World!');
        } catch (e) {
            err = e;
        }

        expect(err).to.be.undefined();
        done();
    });
});

describe('registerHelper()', function () {

    it('exits silenty when passed a function as the second argument', function (done) {

        var err;

        try {
            HapiDust.module.registerHelper('test-helper', Hoek.ignore);
        } catch (e) {
            err = e;
        }

        expect(err).to.be.undefined();
        done();
    });

    it('exits silenty when passed an array as the second argument', function (done) {

        var err;

        try {
            HapiDust.module.registerHelper('test-helper', ['one', 'two']);
        } catch (e) {
            err = e;
        }

        expect(err).to.be.undefined();
        done();
    });
});

describe('Rendering', function () {

    it('renders view', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/valid'
        });

        server.render('test', { title: 'test', message: 'Hapi' }, function (err, rendered, config) {

            expect(rendered).to.exist();
            expect(rendered).to.contain('Hapi');
            done();
        });
    });

    it('renders view (streaming)', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/valid'
        });

        var options = {
            runtimeOptions: {
                streaming: true
            }
        };

        server.render('test', { title: 'test', message: 'Hapi' }, options, function (err, rendered, config) {

            expect(rendered).to.exist();
            expect(rendered).to.be.an.object();

            var buf = '';
            var finished = false;

            rendered.on('data', function (data) {

                buf += data;
            }).on('end', function () {

                if (finished === false) {
                    finished = true;
                    expect(buf).to.contain('Hapi');
                    done();
                }
            });
        });
    });

    it('loads partials and is able to render them', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/valid',
            partialsPath: __dirname + '/templates/valid/partials'
        });

        server.render('testPartials', {}, function (err, rendered, config) {

            expect(rendered).to.equal(' Nav:<nav>Nav</nav>|<nav>Nested</nav>');
            done();
        });
    });

    it('loads partials and is able to render them (streaming)', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/valid',
            partialsPath: __dirname + '/templates/valid/partials'
        });

        var options = {
            runtimeOptions: {
                streaming: true
            }
        };

        server.render('testPartials', {}, options, function (err, rendered, config) {

            var buf = '';
            var finished = false;

            rendered.on('data', function (data) {

                buf += data;
            }).on('end', function () {

                if (finished === false) {

                    finished = true;
                    expect(buf).to.equal(' Nav:<nav>Nav</nav>|<nav>Nested</nav>');
                    done();
                }
            });
        });
    });

    it('loads helpers and is able to render them', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/valid',
            helpersPath: __dirname + '/templates/valid/helpers'
        });

        server.render('testHelpers', { something: 'uppercase' }, function (err, rendered, config) {

            expect(rendered).to.equal('<p>This is all UPPERCASE and this is how we like it!</p>');
            done();
        });
    });

    it('loads helpers and is able to render them (streaming)', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/valid',
            helpersPath: __dirname + '/templates/valid/helpers'
        });

        var options = {
            runtimeOptions: {
                streaming: true
            }
        };

        server.render('testHelpers', { something: 'uppercase' }, options, function (err, rendered, config) {

            var buf = '';
            var finished = false;

            rendered.on('data', function (data) {

                buf += data;
            }).on('end', function () {

                if (finished === false) {

                    finished = true;
                    expect(buf).to.equal('<p>This is all UPPERCASE and this is how we like it!</p>');
                    done();
                }
            });
        });
    });

    it('loads filters and is able to render them', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/valid',
            helpersPath: __dirname + '/templates/valid/filters'
        });

        server.render('testFilters', { something: 'uppercase' }, function (err, rendered, config) {

            expect(rendered).to.equal('<p>It is almost never a good idea to UPPERCASE text in HTML!</p>');
            done();
        });
    });

    it('loads filters and is able to render them (streaming)', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/valid',
            helpersPath: __dirname + '/templates/valid/filters'
        });

        var options = {
            runtimeOptions: {
                streaming: true
            }
        };

        server.render('testFilters', { something: 'uppercase' }, options, function (err, rendered, config) {

            var buf = '';
            var finished = false;

            rendered.on('data', function (data) {

                buf += data;
            }).on('end', function () {

                if (finished === false) {

                    finished = true;
                    expect(buf).to.equal('<p>It is almost never a good idea to UPPERCASE text in HTML!</p>');
                    done();
                }
            });
        });
    });

    it('errors on a malformed template', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/invalid'
        });

        server.render('test', { message: 'Hapi' }, function (err, rendered, config) {

            expect(err.output.statusCode).to.equal(500);
            done();
        });
    });

    it('errors on a malformed template (streaming)', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register(Vision, Hoek.ignore);

        server.views({
            engines: { dust: HapiDust },
            path: __dirname + '/templates/invalid'
        });

        var options = {
            runtimeOptions: {
                streaming: true
            }
        };

        server.render('test', { message: 'Hapi' }, options, function (err, rendered, config) {

            expect(err.output.statusCode).to.equal(500);
            done();
        });
    });



});
