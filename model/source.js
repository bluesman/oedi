/*

data source - this is a service or api from which data can be aggregated.
usually the source requires credentials in order to access data.
credentials are found in the provider-source-credentials collection.
a provider provides credentials for sources and their data is namespaced so that access can be regulated

 */

module.exports = {
	Model: function(mongoose) {
		var Schema = mongoose.Schema;
		var Source = new Schema({
			domain: {
				type: String,
				required: true,
				index: {
					unique: true
				}
			},
			provides: {
				type: Array,
				required: true,
				index: true
			},
			name: String,
			shortName: {
				type: String,
				required: true,
				index: {
					unique: true
				}
			},
			created: {
				type: Date,
				default: Date.now
			},
			updated: Date,
		}, {
			collection: 'source'
		});

		return mongoose.model('source', Source);

		Source.pre('save', function(next) {
			this.updated = new Date();
			next();
		});
	}
};
