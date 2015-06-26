var dust
var fs = require('fs')
var Path = require('path')

try {
  dust = require('dustjs-linkedin')
  try { require('dustjs-helpers') }
  catch (ex) {}
}
catch (ex) {
  try { dust = require('dust') }
  catch (ex) {}
}

if (!dust) throw new Error('"dustjs-linkedin" or "dust" module not found')

module.exports = {
  module: {

    compile: function(template, options, callback) {

      var compiled = dust.compileFn(template, options && options.name)

      callback(null, function(context, options, callback) {
        compiled(context, callback)
      })
    },

    registerPartial: function(name, data) {
      dust.compileFn(data, name)
    },

    registerHelper: function(name, helper) {
      if (helper.length > 1)
        dust.helpers[name] = helper
      else
        dust.filters[name] = helper
    }

  },
  compileMode: 'async'
}
