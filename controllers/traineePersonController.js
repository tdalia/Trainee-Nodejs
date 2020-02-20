
const { body,validationResult,sanitizeBody } = require('express-validator');
//const { sanitizeBody } = require('express-validator/filter');

var TraineePerson = require('../models/traineePerson');

var async = require('async');

exports.index = function(req, res) {
    async.series({
        // Get count of trainees
        trainee_count: function(callback) {
            TraineePerson.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Trainee Management System', error: err, data: results});
    });
};

// Display list of all Trainees
exports.trainee_list = function(req, res) {

    TraineePerson.find()
        .populate('traineepeople')
        .sort([['family_name', 'ascending']])
        .exec(function(err, list_trianees) {
            if (err) {  return next(err);   }

            // Successful
            res.render('trainee_list', { title: 'Trainees List', trainee_list: list_trianees });
        })
    
};

// Display details of a Trainee
exports.trainee_detail = function(req, res, next) {
    async.parallel({
        trainee: function(callback) {
            TraineePerson.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results) {
        if (err)  { return next(err);   }
        // Not found
        if (results.trainee==null) {
            var err = new Error('Trainee not found.');
            err.status = 404;
            return next(err);
        }
        // Successful
        res.render('trainee_detail', { title: 'Trainee Details', trainee: results.trainee });
    });
};

// Display Trainee Create form on GET
exports.trainee_create_get = function(req, res, next) {
    var genders = ['Male', 'Female', 'Other'];
    res.render('trainee_form', { title: 'Create Trainee', genders: genders });
};

// Handle Trainee Create form on POST
exports.trainee_create_post = [
    // Validate fields
    body('first_name').isLength({ min: 1}).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('email', 'Invalid Email').optional({ checkFalsy: true }).isEmail(),
    body('gender').isLength({ min: 1 }).trim().withMessage('Select Gender'),
    body('message', 'Message contains invalid characters').optional({ checkFalsy: true }).trim().isString(),
    body('experiencedTechno', 'Invalid technologies').optional({ checkFalsy: true }).trim().isString(),
    
    // Sanitize fields
    sanitizeBody('*').escape(),
    sanitizeBody('date_of_birth').toDate(),

    // Process request after validation & sanitization
    (req, res, next) => {

        console.log('Into callback');
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        console.log('Errors: ' + errors);

        if (!errors.isEmpty()) {
            async.parallel({
                genders: ['Male', 'Female', 'Other'],
            }, function(err, results) {
                if (err)    {   return next(err);   }

                // Mark selected gender
                for (let i = 0; i < results.genders.length; i++) {
                    if (trainee.gender.indexOf(results.genders[i]) > -1) {
                        results.genders[i].checked='true';
                    }
                }
                res.render('trainee_form', { title: 'Create Trainee', trainee: req.body, genders: results.genders, errors: errors.array() });
            });            
            return;
        }
        else {
            // Data is valid
            console.log('Data is Valid. Creating & Saving trainee.');

            // Create TraineePerson obj
            var trainee = new TraineePerson(
                {
                    first_name: req.body.first_name, 
                    family_name: req.body.family_name, 
                    date_of_birth: req.body.date_of_birth, 
                    email: req.body.email, 
                    gender: req.body.gender,
                    message: req.body.message,
                    experiencedTechno: req.body.experiencedTechno
                });
            console.log("Trainee Created : " + trainee);
            trainee.save(function(err) {
                if (err) {
                    return next(err);
                }
                console.log('Saved. Redirecting');
                // Successful. Redirect to newly created trainee
                res.redirect(trainee.url);
            });
        }
    }
];

// Display Trainee Update form on GET
exports.trainee_update_get = function(req, res, next) {
    console.log("Into update GET");
    async.series({
        trainee: function(callback) {
            TraineePerson.findById(req.params.id)
            .exec(callback);
        },
    }, function(err, results) {
        if (err) {
            console.log("Error: " + err);
            return next(err);
        }
        if(results.trainee==null) {
            var err = new Error('Trainee not found.');
            err.status = 404;
            console.log("Trainee Null Error: " + err);
            return next(err);
        }
        console.log("Trainee: " + results.trainee);
        var genders= ['Male', 'Female', 'Other'];

        // Successful
        // Mark selected gender
        /*for (let i = 0; i < results.genders.length; i++) {
            if (trainee.gender.indexOf(results.genders[i]) > -1) {
                results.genders[i].checked='true';
            }
        }*/
        res.render('trainee_form', { title: 'Update Trainee', trainee: results.trainee, genders: genders });
    });
};

// Handle Trainee Create form on POST
exports.trainee_update_post = [
    // Validate fields
    body('first_name').isLength({ min: 1}).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('email', 'Invalid Email').optional({ checkFalsy: true }).isEmail(),
    body('gender').isLength({ min: 1 }).trim().withMessage('Select Gender'),
    body('message', 'Message contains invalid characters').optional({ checkFalsy: true }).trim().isString(),
    body('experiencedTechno', 'Invalid technologies').optional({ checkFalsy: true }).trim().isString(),
    
    // Sanitize fields
    sanitizeBody('*').escape(),
    sanitizeBody('date_of_birth').toDate(),

    // Process request after validation & sanitization
    (req, res, next) => {

        console.log('Into callback');
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        console.log('Errors: ' + errors);

        // Create TraineePerson obj with escaped/trimmed data and old id.
        var trainee = new TraineePerson(
            {
                first_name: req.body.first_name, 
                family_name: req.body.family_name, 
                date_of_birth: req.body.date_of_birth, 
                email: req.body.email, 
                gender: req.body.gender,
                message: req.body.message,
                experiencedTechno: req.body.experiencedTechno,
                _id: req.params.id
            });

        if (!errors.isEmpty()) {
            async.parallel({
                genders: ['Male', 'Female', 'Other'],
            }, function(err, results) {
                if (err)    {   return next(err);   }

                // Mark selected gender
                for (let i = 0; i < results.genders.length; i++) {
                    if (trainee.gender.indexOf(results.genders[i]) > -1) {
                        results.genders[i].checked='true';
                    }
                }
                res.render('trainee_form', { title: 'Update Trainee', trainee: trainee, genders: results.genders, errors: errors.array() });
            });            
            return;
        }
        else {
            // Data from form is valid. Update the record.
            TraineePerson.findByIdAndUpdate(req.params.id, trainee, {}, function(err, theTrainee) {
                if (err) { return next(err);    }
                // Successful. Redirect to details page
                res.redirect(theTrainee.url);
            });
        }
    }
];

// Display Trainee Delete form on GET
exports.trainee_delete_get = function(req, res, next) {
    async.series({
        trainee: function(callback) {
            TraineePerson.findById(req.params.id).exec(callback)
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if(results.trainee==null) {
            res.redirect('/trainee/trainees');
        }
        // Successful
        res.render('trainee_delete', { title: 'Delete Trainee', trainee: results.trainee });
    });
};
 
// Handle Trainee Delete form on POST
exports.trainee_delete_post = function(req, res) {
    async.series({
        trainee: function(callback) {
            TraineePerson.findById(req.body.traineeid).exec(callback)
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        // Success
        TraineePerson.findByIdAndRemove(req.body.traineeid, function deleteTrainee(err) {
          if (err)  { return next(err); }  
          // Success - go to list
          res.redirect('/trainee/trainees')
        });
    });
};