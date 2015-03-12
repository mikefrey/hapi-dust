var assert = require('assert')

var dust = require('../index')

var options = {baseDir: "test/templates"}

assert(dust.module, 'module does not exist')
assert(dust.module.compile, 'compile does not exist')
assert.equal(dust.compileMode, 'async', 'compileMode not properly set')

dust.module.compile('hello {x}!', null, function(err, fn) {
  assert(!err, 'compile resulted in error')
  assert.equal(typeof fn, 'function', 'compile result not a function')

  fn({ x: 'world' }, null, function(err, str) {
    assert(!err, 'render resulted in error')
    assert.equal(str, 'hello world!', 'unexpected render result')
  })
})

// partials
dust.module.compile('hello {x}!{>_include /}', options, function(err, fn) {
  assert(!err, 'compile resulted in error')
  assert.equal(typeof fn, 'function', 'compile result not a function')

  fn({ x: 'world' }, null, function(err, str) {
    assert(!err, 'render resulted in error')
    assert.equal(str, 'hello world!I am an include.', 'unexpected partial render result: ' + str)
  })
})

// layouts
dust.module.compile('{>_layout /}{<content}hello {x}!{/content}', options, function(err, fn) {
  assert(!err, 'compile resulted in error')
  assert.equal(typeof fn, 'function', 'compile result not a function')

  fn({ x: 'world' }, null, function(err, str) {
    assert(!err, 'render resulted in error')
    assert.equal(str, 'I am a layout.hello world!', 'unexpected layout render result: ' + str)
  })
})
