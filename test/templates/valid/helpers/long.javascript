exports = module.exports = function (chunk, context, bodies, params) {
	return chunk.write(params.text);
};
