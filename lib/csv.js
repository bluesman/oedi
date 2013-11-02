var fs = require('fs');
var csv = require('csv');
var http = require('http');
var https = require('https');
var async = require('async');

function streamUrl(url, cb) {
	if (/^https/.test(url)) {
		https.get(url, function(res) {
			cb(res);
		});
	} else {
		http.get(url, function(res) {
			cb(res);
		});
	}
};

function streamFile(path, cb) {
	var s = fs.createReadStream(path);
	cb(s);
};

function getStreamHandler(str, cb) {
	if (/^http/.test(str)) {
		streamUrl(str, cb);
	} else {
		streamFile(str, cb);
	}
};

module.exports = {

	parse: function(file, opts, handleFile, handleRow, handleCol) {
		console.log('parse file: ' + file);
		console.log(opts);

		getStreamHandler(file, function(stream) {
			console.log('readCsv');
			csv()
				.from.stream(stream, {
					delimiter: opts.delimiter || ',',
					columns: opts.columns || true
				})
				.to.array(function(data) {

					/* loop through each row */
					async.eachSeries(data, function(row, next) {
							/* loop through each k,v for this row */
							async.eachSeries(Object.keys(row), function(k, cb) {
									handleCol(k, row[k], cb);
								},
								function(err, result) {
									handleRow(err, result, next);
								});
						},

						//finished all rows

						function(err, result) {
							handleFile(err, result);
						});
				});

		});


	}
};
