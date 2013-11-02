var rpc = require('jsonrpc-client');

var jsonRpc = {
	"jsonrpc": "2.0",
	"id": 1,
	"params": {}
};

var headers = {"Content-Type": "application/json"};

rpc.call('