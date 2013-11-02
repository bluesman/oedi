var kue = require('kue');
var jobs = kue.createQueue();

/* https://github.com/learnboost/kue */
if (typeof process.argv[2] === "undefined") {
	console.log('Usage: node kue_performer Padres');
	process.exit(code=0);
}
var job = jobs.create('performer_name',{title:process.argv[2],name:process.argv[2]}).priority('normal').save(function(err) {
	if (err) {
	    return console.log('failed putting '+name+' into venue_name queue: '+err);
	}
	console.log('put '+process.argv[2]+' into venue_name queue');
	job.log('added %s to queue',process.argv[2]);
	process.exit(code=0);
});



