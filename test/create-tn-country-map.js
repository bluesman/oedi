var wembliUtils = require('/wembli/website/lib/wembli/utils');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oedi');

/* this script will create a mapping between oedi universal performer and ticketnetwork performer */
var SourceCountryMap = require('../model/source_country_map').Model(mongoose);
var Source = require('../model/source').Model(mongoose);

/* get tn source id */
Source.findOne().where('shortName').equals('tncsv').exec(function(err, source) {
	console.log('got tncsv source');
	console.log(source);

	var map = {
		"CountryID": "dataId",
		"CountryShortDesc": "code",
		"CountryLongDesc": "name"
	};

	var sourceCountryMap = {
		sourceId: source._id,
		sourceToUniversal: map,
	};

	var m = new SourceCountryMap(sourceCountryMap);
	console.log(m);
	m.save(function(err) {
		console.log('saved scm');
		console.log(err);
		mongoose.connection.close();
	});


});
