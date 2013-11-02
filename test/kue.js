var kue = require('kue');
var jobs = kue.createQueue();

/* https://github.com/learnboost/kue */

var name = 'Petco Park 2';
var job = jobs.create('venue_name',{title:name,name:name}).priority('normal').save(function(err) {
	if (err) {
	    return console.log('failed putting '+name+' into venue_name queue: '+err);
	}
	console.log('put '+name+' into venue_name queue');
	job.log('added %s to queue',name);
	jobs.process('venue_name',function(job, done) {
		console.log('processing venue: '+job.data.name);
		done();
	});
});







