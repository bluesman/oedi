var wembliUtils = require('/wembli/website/lib/wembli/utils');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oedi');

/* this script will create a mapping between oedi universal performer and ticketnetwork performer */
var SourceVenueMap = require('../model/source_venue_map').Model(mongoose);
var Source = require('../model/source').Model(mongoose);

/* get tn source id */
Source.findOne().where('shortName').equals('tn').exec(function(err,source) {
	console.log('got tn source');
	console.log(source);

	var map = {
	    "ID":"dataId",
	    "Name":"name",
	    "Capacity":"capacity",
	    "Street1":"address",
	    "Street2":"address2",
	    "City":"city",
	    "StateProvince":"State",
	    "ZipCode":"postalCode",
	    "Country":"country"
	};
	var sourceVenueMap = {
	    sourceId: source._id,
	    sourceToUniversal:map,
	};

	var m = new SourceVenueMap(sourceVenueMap);
	console.log(m);
	m.save(function(err) {
		console.log('saved svm');
		console.log(err);
	mongoose.connection.close();
	    });


});


