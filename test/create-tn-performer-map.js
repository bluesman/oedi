var wembliUtils = require('/wembli/website/lib/wembli/utils');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oedi');

/* this script will create a mapping between oedi universal performer and ticketnetwork performer */
var SourcePerformerMap = require('../model/source_performer_map').Model(mongoose);
var Source = require('../model/source').Model(mongoose);

/* get tn source id */
Source.findOne().where('shortName').equals('tn').exec(function(err,source) {
	console.log('got tn source');
	console.log(source);

	var map = {
	    "ID":"dataId",
	    "Description":"name"
	};
	var sourcePerformerMap = {
	    sourceId: source._id,
	    sourceToUniversal:map,
	};

	var m = new SourcePerformerMap(sourcePerformerMap);
	console.log(m);
	m.save(function(err) {
		console.log('saved spm');
		console.log(err);
	mongoose.connection.close();
	    });


});


