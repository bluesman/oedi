/*

source_performer - performer data froma  given source

 */
require('date-utils');

module.exports = {
	Model: function(mongoose) {
		var Schema = mongoose.Schema;
		var SourcePerformer = new Schema({
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
			expires: Date,
		}, {
			collection: 'sourcePerformer'
		});

		SourcePerformer.pre('save', function(next) {
			var now = Date.today();
			now.setTimeToNow();
			var exp = now.clone();
			this.updated = now;
			//this.expires = Date.now() + (60 * 60 * 24 * 7 * 12); /* 6 months */
			this.expires = exp.add({minutes:1});
			next();
		});

		return mongoose.model('sourcePerformer', SourcePerformer);

	}
};
