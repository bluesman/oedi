var rpc = require('jsonrpc-client');
var client = rpc.create('http://tom.wembli.com/');
client.call('event.get',{args:{nearZip:'90201'}},function(err,response) {
	console.log(err);
	console.log(response);
});
