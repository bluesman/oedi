/*

this is data about a provider. a provider is someone who adds sources to the system.
a provider has credentials for each source
a provider has a namespace to segregate data she provides

 */

module.exports = {
	Model: function(mongoose) {
		var Schema = mongoose.Schema;
		var Provider = new Schema({
			username: {
				type: String,
				required: true,
				index: {
					unique: true
				}
			},
			password: String,
			confirmed: {
				type: Boolean,
				default: false
			},
			confirmation: {
				timestamp: String,
				token: String
			},
			forgotPassword: {
				timestamp: String,
				token: String
			},
			created: {
				type: Date,
				default: Date.now
			},
			updated: Date,
		}, {
			collection: 'provider'
		});

		return mongoose.model('provider', Provider);


		Provider.pre('save', function(next) {
			this.updated = new Date();
			next();
		});
	}
};
