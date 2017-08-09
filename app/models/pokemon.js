var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PokemonSchema   = new Schema({
	name: String,
	pokedexId: Number,
	imgUrl: String
});

module.exports = mongoose.model('Pokemon', PokemonSchema);