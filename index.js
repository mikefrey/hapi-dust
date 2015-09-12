// Load modules

var Dust = require('dustjs-helpers');

// Declare internals

var internals = {};


internals.render = function (tmpl) {

    return function (context, options, callback) {

        if (options.streaming) {

            try {
                var stream = tmpl(context);
            } catch (err) {
                return callback(err, null);
            }

            return callback(null, stream);
        }

        return tmpl(context, callback);
    };
};

// Declare module

exports.module = {};


exports.module.compile = function (template, options, callback) {

    try {
        var tmpl = Dust.compileFn(template, options.filename);
    } catch (err) {
        return callback(err, null);
    }

    var renderFn = internals.render(tmpl);

    return callback(null, renderFn);
};

exports.module.prepare = function (config, next) {

    var err = null;

    if (config.compileMode !== 'async') {
        err = new Error('compileMode must be async for hapi-Dust');
    }

    next(err);
};

exports.module.registerPartial = function (name, src) {

    var tmpl = Dust.compileFn(src, name);
};

exports.module.registerHelper = function (name, helper) {

    if (helper.length > 1) {
        Dust.helpers[name] = helper;
    } else {
        Dust.filters[name] = helper;
    }
};

exports.compileMode = 'async';
