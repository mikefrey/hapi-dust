exports = module.exports = function (chunk, context, bodies) {

    return chunk.tap(function (data) {

        return data.toUpperCase();
    }).render(bodies.block, context).untap();
};
