hapi-dust
=========

dust.js + hapi

## Installation

```
npm install hapi-dust --save
```

## Dependencies

`hapi-dust` will try to load the dustjs engine using node's `require()`. Which
means you'll also need to install `dust` or `dustjs-linkedin`:

```
npm install dustjs-linkedin --save
# or
npm install dust --save
```

If you're using `dustjs-linkedin`, `hapi-dust` will also try to load
`dustjs-helpers`, which you'll also need to install if you want helpers
support.

```
npm install dustjs-linkedin --save
```

## Usage

Load `hapi-dust` in your hapi server views configuration:

```js
var server = new Hapi.Server(1337, {
  views: {
    engines: { html: require('hapi-dust') },
    path: __dirname + '/path/to/templates'
  }
})
```
