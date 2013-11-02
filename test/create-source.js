var wembliUtils = require('/wembli/website/lib/wembli/utils');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oedi');

var Source = require('../model/source').Model(mongoose);

var s = {
	domain:'ticketnetwork.com',
	name:'Ticket Network',
	provides:['venue','performer','event'],
	shortName:'tn'
};

var s = {
	domain:'feed.ticketnetwork.com',
	name:'Ticket Network CSV',
	provides:['venue','performer','event', 'postal-code', 'country', 'state', 'category'],
	shortName:'tncsv'
};

var source = new Source(s);
source.save();

mongoose.connection.close();
