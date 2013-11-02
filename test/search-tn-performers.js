var rpc = require('jsonrpc-client');
var client = rpc.create('http://tom.wembli.com/');
client.call('performer.search',{args:{searchTerms:'john mayer'}},function(err,response) {
	console.log(response);
	client.call('event.get',{args:{performerID:response.performer[0].ID}},function(err,response) {
		console.log(err);
		console.log(response);
	});
});
