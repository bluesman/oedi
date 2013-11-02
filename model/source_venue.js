/*

venues by source - this should be the minimum necessary data needed in order to fetch a venue from a given source using the venue source data

 */

module.exports = {
	Model: function(mongoose) {
		var Schema = mongoose.Schema;
		var SourceVenue = new Schema({
			providerId: String,
			sourceId: String,
			dataId: {
				type: String,
				index: true
			},
			data: {},
			created: {
				type: Date,
				default: Date.now
			},
			updated: Date,
		}, {
			collection: 'sourceVenue'
		});

		return mongoose.model('sourceVenue', SourceVenue);

		Provider.pre('save', function(next) {
			this.updated = new Date();
			next();
		});
	}
};
