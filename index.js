// Load modules

var Dust = require('dustjs-helpers');

// Declare internals

var internals = {};


internals.render = function (tmpl) {

    return function (context, options, callback) {

        if (options.streaming) {

            var stream = null;

            try {
                stream = tmpl(context);
            } catch (err) {
                return callback(err);
            }

            return callback(null, stream);
        }

        return tmpl(context, callback);
    };
};

// Declare module

exports.module = {};


exports.module.compile = function (template, options, callback) {

    var tmpl = null;

    try {
        tmpl = Dust.compileFn(template, options.filename);
    } catch (err) {
        return callback(err);
    }

    return callback(null, internals.render(tmpl));
};

exports.module.prepare = function (config, next) {

    if (config.compileMode !== 'async') {
        return next(new Error('compileMode must be async for hapi-Dust'));
    }

    return next();
};

exports.module.registerPartial = function (name, src) {

    try {
        Dust.loadSource(Dust.compile(src, name));
    } catch (err) { }
};

exports.module.registerHelper = function (name, helper) {

    if (helper.length > 1) {
        Dust.helpers[name] = helper;
    } else {
        Dust.filters[name] = helper;
    }
};

exports.compileMode = 'async';
