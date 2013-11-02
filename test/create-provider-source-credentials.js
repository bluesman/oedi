var wembliUtils = require('/wembli/website/lib/wembli/utils');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oedi');

var Source = require('../model/source').Model(mongoose);
var Provider = require('../model/provider').Model(mongoose);
var providerSourceCredentials = require('../model/provider_source_credentials').Model(mongoose);

//Provider.findById("515643057c8819f9e2000001",function(err,p) {
/* get provider wembli */
var shortName = 'tn';
shortName = 'tncsv';

var credentials = {
	WebsiteConfigId: 8582
};

credentials = {

};


var q = Provider.findOne({
	username: 'tom@wembli.com'
}).exec(function(err, p) {
	console.log('err:' + err);
	console.log(p);
	var providerId = p.id;
	console.log('provider: ' + providerId);
	Source.findOne({
		shortName: shortName
	}, function(err, s) {
		var sourceId = s.id;
		console.log('source: ' + sourceId);


		var psc = {
			sourceId: sourceId,
			providerId: providerId,
			credentials: credentials
		};

		var pscObj = providerSourceCredentials(psc);
		pscObj.save(function() {
			mongoose.connection.close();
		});
	});
});
