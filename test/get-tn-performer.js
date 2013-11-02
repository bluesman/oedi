var rpc = require('jsonrpc-client');
var client = rpc.create('http://tom.wembli.com/');
client.call('performer.search',{args:{searchTerms:'Dave Matthews Band'}},function(err,response) {
	console.log(err);
	console.log(response);

	client.call('performer.get',{args: {PerformerID:response.performer[0].ID}},function(err,performer) {
		console.log(err);
		console.log(performer);
	    });

});
