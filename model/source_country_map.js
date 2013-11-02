var async = require('async');

/*

this is a model into the mapping data for performers.  this is more like a template that tells an app how
to map source specific data provided by a performer data source to the universal performer record

 */

module.exports = {
	Model: function(mongoose) {
		var Schema = mongoose.Schema;
		var SourceCountryMap = new Schema({
			sourceId: String,
			universalToSource: {},
			sourceToUniversal: {},
			created: {
				type: Date,
				default: Date.now
			},
			updated: Date,
		}, {
			collection: 'sourceCountryMap'
		});

		SourceCountryMap.pre('save', function(next) {
			this.updated = new Date();
			var copy = this;
			/* reverse the map */
			if (typeof this.universalToSource !== "undefined") {
				this.markModified('sourceToUniversal');
				this.sourceToUniversal = {};
				async.forEach(Object.keys(this.universalToSource), function(key, callback) {
						copy.sourceToUniversal[copy.universalToSource[key]] = key;
						callback();
					},

					function(err, result) {
						next();
					});

			} else if (typeof this.sourceToUniversal !== "undefined") {
				this.markModified('universalToSource');
				this.universalToSource = {};
				async.forEach(Object.keys(this.sourceToUniversal), function(key, callback) {
						copy.universalToSource[copy.sourceToUniversal[key]] = key;
						callback();
					},

					function(err, result) {
						next();
					});

			} else {
				next();
			}
		});

		return mongoose.model('sourceCountryMap', SourceCountryMap);

	}
};
