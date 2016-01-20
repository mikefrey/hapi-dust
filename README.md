hapi-dust [![Travis CI](https://travis-ci.org/mikefrey/hapi-dust.svg)](https://travis-ci.org/mikefrey/hapi-dust)
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
npm install dustjs-helpers --save
```

## Usage

Load `hapi-dust` in your hapi server views configuration:

```js
server.views({
  engines: { dust: require('hapi-dust') },
  relativeTo: Path.join(__dirname),
  path: 'path/to/templates',
  partialsPath: 'path/to/partials',
  helpersPath: 'path/to/helpers',
})
```
