var dust

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
      process.nextTick(function() {
        callback(null, function(context, options, callback) {
          compiled(context, callback)
        })
      })
    }
  },
  compileMode: 'async'
}
