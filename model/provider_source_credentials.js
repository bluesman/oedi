/*

provider source credentials - maps providers to source and holds credentials

 */

module.exports = {
	Model: function(mongoose) {
		var Schema = mongoose.Schema;
		var c = new Schema({
			sourceId: {type: Schema.Types.ObjectId, index: true},
			providerId: {type: Schema.Types.ObjectId, index:true},
			credentials: {},
			created: {
				type: Date,
				default: Date.now
			},
			updated: Date,
		}, {
			collection: 'providerSourceCredentials'
		});

		return mongoose.model('providerSourceCredentials', c);

		c.pre('save', function(next) {
			this.updated = new Date();
			next();
		});
	}
};
