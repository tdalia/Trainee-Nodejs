#! /usr/bin/env node

console.log('This script populates some test trainees to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var TraaineePerson = require('./models/TraineePerson')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var trainees = []

function traineeCreate(firstname, familyname, dob, email, gender, cb) {
    traineedetail = {first_name: firstname, family_name: familyname, 
        date_of_birth: dob, email: email, gender: gender}
    
    var trainee = new TraaineePerson(traineedetail);

    trainee.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Trainee: ' + trainee);
        trainees.push(trainee);
        cb(null, trainee);
    });
}

function createTrainees(cb) {
    async.series([
        function(callback) {
            traineeCreate('Patrick', 'Rothfuss', '8-11-1982', 'patrick@gmail.com', 'Male', callback);
        },
        function(callback) {
            traineeCreate('Ben', 'Smith', '10-1-1995', 'ben@gmail.com', 'Female', callback);
        },
        function(callback) {
            traineeCreate('Jim', 'Johny', '12-25-1979', 'jimmy@gmail.com', 'Other', callback);
        }
    ], cb);
}

async.series([
    createTrainees
], 
// Optional callback
function(err, results) {
    if (err) {
        console.log('Final ERR : ' + err);
    } 
    else {
        console.log('Trainees: ' + trainees);
    }
    // All done, disconnect from db
    mongoose.connection.close();
});