var wembliUtils = require('/wembli/website/lib/wembli/utils');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oedi');

var Provider = require('../model/provider').Model(mongoose);

var digest = wembliUtils.digest('W@lp0l31');

var p = {
    username:'tom@wembli.com',
    password:digest,
    confirmed:true
};

/* create a confirmation token */
var confirmationTimestamp = new Date().getTime().toString();
var digestKey = p.username + confirmationTimestamp;
var confirmationToken = wembliUtils.digest(digestKey);

p.confirmation = {
    timestamp: confirmationTimestamp,
    token: confirmationToken
};

var provider = new Provider(p);
provider.save();

mongoose.connection.close();
