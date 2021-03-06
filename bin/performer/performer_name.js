/*

this script reads from the performer_name queue and fetches performer data from the various sources.

HERE'S WHAT IT DOES

1. Get a performer name from the performer_name kue
2. Get a list of sources that provide performer data
3. For each Source:
   1. Get credentials for the source
   2. Get the performerMap object - which maps this source's data fields to
      the universal performer data fields
   3. Call the source's search performer by name method
   4. For each Source's Performer
      1. Check if this performer is already in the sourcePerformer collection
         if it is: check if it's expired, if so overwrite the expired one, else next
	 if it is not: create a new sourcePerformer for this data and add it to the sourcePerformer collection
   5. for those source performers that got added/updated, add their venue to the venue_name kue


TODO:

 */

var kue = require('kue');
var jobs = kue.createQueue();
var async = require('async');
var rpc = require('jsonrpc-client');
var client = rpc.create('http://tom.wembli.com/');

/* connect to mongo */
var model = require('../../lib/models');

var fetchPerformers = {
	/* get a list of performers that match the query */
	'tn': function(credentials, query, cb) {
		console.log('credenitals');
		console.log(credentials);

		/* get our tn performer dataMap Obj */
		model.source.PerformerMap.findOne().where('sourceId').equals(credentials.sourceId).exec(function(err, spm) {

				console.log('source performer data map');
				console.log(spm);
				console.log(err);

				var finished = function(err) {
					console.log('finished inserting performers for tn');

					/* done finding performers for this source */
					cb();
				};


				var handlePerformer = function(performer, cb) {

					var handleSave = function(sp) {
						async.parallel([
								function(parallelCb) {
									/* insert into the venue_id to fetch events and venues */
									console.log('insert performer venues into venue_id queue');
									console.log(sp.data[spm.universalToSource['name']]);
									var job = jobs.create('venue_id', {
										title: sp.data[spm.sourceToUniversal.name],
										dataId: sp.data[spm.sourceToUniversal.dataId],
										sourceId: credentials.sourceId,
									}).priority('normal').save(function(err) {
										console.log('added tn venue to venue_id');
										parallelCb();
									});
								},
								function(parallelCb) {

									/* insert into the event_id queue to fetch events and venues */
									console.log('insert performer events into event_id queue');
									console.log(sp.data[spm.universalToSource['name']]);
									var job = jobs.create('event_id', {
										title: sp.data[spm.sourceToUniversal.name],
										dataId: sp.data[spm.sourceToUniversal.dataId],
										sourceId: credentials.sourceId,
									}).priority('normal').save(function(err) {
										console.log('added tn venue to venue_id');
										parallelCb();
									});
								},

								cb();
							};

							model.source.Performer.findOne().where('dataId').equals(performer[spm.universalToSource['dataId']]).exec(function(err, existing) {
								if (existing === null) {
									/* add the new document to the source_performer collection */
									/* insert the performer document id into the source_performer_queue */
									var p = {
										providerId: credentials.providerId,
										sourceId: credentials.sourceId,
										dataId: performer[spm.universalToSource['dataId']],
										data: performer
									};
									console.log('creating new source_performer');
									console.log(p);
									var sp = new model.source.Performer(p);
									sp.save(function(err) {
										handleSave(sp);
									});
								} else {
									console.log('this performer already exists is it expired?');
									var compare = Date.today();
									compare.setTimeToNow();
									console.log('compare:');
									console.log(compare + ' to ' + existing.expires);
									if (compare.isAfter(existing.expires)) {
										console.log('existing perform but its expired updating the data');
										/* its expired - update data in the sourcePerformer */
										existing.data = performer;
										existing.save(function(err) {
											handleSave(existing);
										});
									} else {
										cb();
									}
								}
							});
						};

						/* get matching performers from this source */
						client.call('performer.search', {
							args: {
								"searchTerms": query
							}
						}, function(err, response) {
							console.log(err);
							console.log(response);
							/* insert each performer into sourcePerformer collection using handlePerformer() */
							async.forEach(response.performer, handlePerformer, finished);
						});

						/* TODO: ticketnetwork does not have a search performer so it won't work as a source here */
						/* seat geek does though */
					});
			}
		};

		/*
   first, grab a list of performer sources and their credentials
   - select * from performer_source
   - select * from providerSourceCredentials where 'performer' in provides
   - foreach credential
*/

		/* pull from the performer_name job queue */
		jobs.process('performer_name', function(job, done) {
			console.log('processing performer: ' + job.data.name);

			var findPerformers = function(performerSource, cb) {
				console.log(performerSource);
				/* get credentials for this performerSource */
				model.credentials.ProviderSource.findOne().where('sourceId').equals(performerSource._id).exec(function(err, psc) {
					console.log('got credentials for this performer source');
					console.log(psc);
					/* call the appropriate 'getPerformers' method based on this source */
					fetchPerformers[performerSource.shortName](psc, job.data.name, cb);
				});
			};

			/* after each performer source */
			var finished = function(err) {
				if (err) {
					done(err);
				} else {
					console.log('done');
					done();
				}
				mongoose.connection.close();
			};

			/* get a list of sources that provide event info by performer name */
			model.performer.Source.find().where("provides"). in (["performer"]).exec(function(err, rows) {
				/* loop through the rows and fetch performer records */
				async.forEach(rows, findPerformers, finished);
			});

		});

		/* query each source for records that match the performer name */

		/* insert results into source_performer collection */

		/* insert source_performer_id into source_performer queue */
