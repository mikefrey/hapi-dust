// Load modules

var Dust = require('dustjs-helpers');

// Declare internals

var internals = {};


internals.render = function (compiled) {

    return function (context, options, callback) {

        if (options.streaming) {

            var stream = null;

            try {
                stream = compiled(context);
            } catch (err) {
                return callback(err);
            }

            return callback(null, stream);
        }

        return compiled(context, callback);
    };
};

// Declare module

exports.module = {};


exports.module.compile = function (template, options, callback) {

    var compiled = null;

    try {
        compiled = Dust.compileFn(template, options.filename);
    } catch (err) {
        return callback(err);
    }

    return callback(null, internals.render(compiled));
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
