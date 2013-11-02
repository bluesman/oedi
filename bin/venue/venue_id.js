/*

this script reads from the performer_name queue and fetches performer data from the various sources.

HERE'S WHAT IT DOES

1. Get a venue name from the venue_id kue
2. Get a list of sources that provide venue data
3. For each Source:
   1. Get credentials for the source
   2. Get the venueMap object - which maps this source's data fields to
      the universal venue data fields
   3. Call the source's search venue by name method
   4. For each Source's venue
      1. Check if this venue is already in the sourceVenue collection
         if it is: check if it's expired, if so overwrite the expired one, else next venue
	 if it is not: create a new sourceVenue for this data and add it to the sourceVenue collection
   5. for those source venues that got added/updated, add their events to the event_name kue

TODO:

 */

var kue = require('kue');
var jobs = kue.createQueue();
var async = require('async');
var rpc = require('jsonrpc-client');
var client = rpc.create('http://tom.wembli.com/');
var model = require('../../lib/models');

var handleVenue = function(venue, cb) {
	/* add the new document to the source_venue collection */
	/* insert the venue document id into the source_venue_queue */
};

var fetchVenues = {
	/* TODO: tn doesn't have venue.search - this venue_name queue will only be useful for sources that let you search for venues...tn does not */
	/* get a list of venues that match the query */
	'tn': function(credentials, query, cb) {
		model.source.VenueMap.findOne().where('sourceId').equals(credentials.sourceId).exec(function(err, spm) {
			var finished = function(err) {
				console.log('finished inserting venues for tn');
				/* get a list of events for this venue and insert them into the event_name queue

		    /* done finding venues for this source */
				cb();
			};


			/* get matching venues from this source */
			client.call('venue.search', {
				args: {
					"searchTerms": query
				}
			}, function(err, response) {
				console.log(err);
				console.log(response);
				/* insert each performer into sourcePerformer collection using handlePerformer() */
				async.forEach(response.venue, handleVenue, finished);
			});

			/* TODO: ticketnetwork does not have a search venue so it won't work as a source here */
			/* seat geek does though */

			/* insert each venue into sourceVenue collection using handleVenue() */
			async.each(venues, handleVenue, finished);
		});
	}
};

/*
   first, grab a list of venue sources and their credentials
   - select * from venue_source
   - select * from providerSourceCredentials where 'venue' in provides
   - foreach credential
*/

/* pull from the venue_name job queue */
jobs.process('venue_name', function(job, done) {
	console.log('processing venue: ' + job.data.name);
	/* query the venueSource using the venueName */

	var findVenues = function(venueSource, cb) {
		/* get credentials for this venueSource */
		model.credentials.ProviderSource.findOne().where('sourceId').equals(venueSource._id).exec(function(err, psc) {
			/* call the appropriate 'getVenues' method based on this source */
			fetchVenues[venueSource.shortName](psc.credentials, job.data.name, cb);
		});
	};

	/* after each venue source */
	var finished = function(err) {
		if (err) {
			done(err);
		} else {
			done();
		}
		mongoose.connection.close();
	};

	model.venue.Source.find().where("provides"). in (["event"]).exec(function(err, rows) {
		console.log('got venue source rows');
		console.log(rows);
		/* loop through the rows and fetch venue records */
		async.each(rows, findVenues, finished);
	});



});

/* pull from the venue_name job queue */
/*
	job has:
		dataId
		sourceId
*/
jobs.process('venue_id', function(job, done) {
	console.log('processing venue id: ' + job.data.dataId + ' source id: ' + job.data.sourceId);
	/* query the venueSource using the venueName */

	var findVenues = function(venueSource, cb) {
		/* get credentials for this venueSource */
		model.credentials.ProviderSource.findOne().where('sourceId').equals(venueSource._id).exec(function(err, psc) {
			/* call the appropriate 'getVenues' method based on this source */
			fetchVenues[venueSource.shortName](psc.credentials, job.data.name, cb);
		});
	};

	/* after each venue source */
	var finished = function(err) {
		if (err) {
			done(err);
		} else {
			done();
		}
		mongoose.connection.close();
	};

	model.venue.Source.find().where("provides"). in (["event"]).exec(function(err, rows) {
		console.log('got venue source rows');
		console.log(rows);
		/* loop through the rows and fetch venue records */
		async.each(rows, findVenues, finished);
	});



});
