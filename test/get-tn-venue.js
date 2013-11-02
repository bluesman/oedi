var rpc = require('jsonrpc-client');
var client = rpc.create('http://tom.wembli.com/');

console.log('VENUE FOR 821');
client.call('venue.get',{args:{VenueID:'821'}},function(err,response) {
	console.log(response);
	console.log('VENUE CONFIGURATIONS:');
	client.call('venue.getConfigurations',{args:{VenueID:'821'}},function(err2,response2) {
		console.log(err2);
		console.log(response2);
	});
});


