var wembliUtils = require('/wembli/website/lib/wembli/utils');
var csv = require('../../lib/csv');
/* connect to mongo */
var model = require('../../lib/models');

/* args:
	-s source
	-u provider username
	-p provider password
*/

var argv = require('optimist')
	.usage('\nImport a csv containing country data from a given source.\n\nUsage: $0 <file|"url">\n\n*note: if using a url - be sure to put quotes around it.')
	.demand('s')
	.describe('s', 'source')
	.alias('s', 'source')
	.demand('u')
	.describe('u', 'provider username')
	.alias('u', 'username')
	.demand('p')
	.describe('p', 'provider password')
	.alias('p', 'password')
	.demand(1)
	.argv;

/* TODO: verify credentials */

/* this script is going to create sourceCountry records for the source passed in */

/* get the provider for this user/pass */
model.credentials.Provider.findOne().where('username').equals(argv.u).exec(function(err, provider) {
	var digest = wembliUtils.digest(argv.p);
	if (provider.password !== digest) {
		console.log('invalid credentials for ' + argv.u);
		process.exit(1);
	}

	/* get the source for this shortName */
	model.country.Source.findOne()
		.where('shortName').equals(argv.s)
		.exec(function(err, source) {

			if (source) {
				console.log(source);
				/* get the credentials for this provider source combo */
				model.credentials.ProviderSource.findOne()
					.where('providerId').equals(provider._id)
					.where('sourceId').equals(source._id)
					.exec(function(err, psc) {
						if (psc) {
							console.log(psc);
							loadCountry[argv.s](psc, function() {

							});

						} else {

							console.log('no provider source credentials for this provider source combo ' + err);
							process.exit(0);

						}


					});
			} else {
				console.log('source ' + argv.s + ' does not exist ' + err);
				process.exit(0);
			}

		});

});


/* get the providerSourceCredentials to know where/how to import this csv data */
/*
model.source.CountryMap.findOne().where('sourceId').equals(credentials.sourceId).exec(function(err, spm) {

});
*/
var loadCountry = {
	'tncsv' : function(credentials, cb) {
		/* get the CountryMap for this source */
		model.source.CountryMap.findOne().where('sourceId').equals(credentials.sourceId).exec(function(err, scm) {
			console.log(scm);
		});
	}
};

function loadFile() {
	console.log('process file: ' + argv._[0]);

	csv.parse(argv._[0], {}, handleFile, handleRow, handleCol);

	function handleFile(err, result) {
		console.log('handle file');
		console.log(result);
	};

	function handleRow(err, result, next) {
		console.log('handle Row');
		console.log(result);
		next();
	};

	function handleCol(key, val, next) {
		console.log('handle Col');
		console.log(key + ':' + val);
		next();
	};
}
