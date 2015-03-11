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
      var fileExtension = options.defaultExtension || 'dust'
      dust.onLoad = function(name, callback) {
          fs.readFile(Path.join(options.basedir, name + '.' + fileExtension), function(err, data) {
          if (err)
            throw err
          callback(err, data.toString())
        })
      }
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
