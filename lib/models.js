/* connect to mongo */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oedi');

var source = require('../model/source').Model(mongoose);

module.exports = {
	source: {
		Venue: require('../model/source_venue').Model(mongoose),
		VenueMap: require('../model/source_venue_map').Model(mongoose),
		Performer: require('../model/source_performer').Model(mongoose),
		PerformerMap: require('../model/source_performer_map').Model(mongoose),
		CountryMap: require('../model/source_country_map').Model(mongoose),
	},
	venue: {
		Source: source
	},
	performer: {
		Source: source
	},
	event: {
		Source: source
	},
	country: {
		Source: source
	},
	postalCode: {
		Source: source
	},
	state: {
		Source: source
	},
	credentials: {
		Provider: require('../model/provider').Model(mongoose),
		ProviderSource: require('../model/provider_source_credentials').Model(mongoose),
	},

};
