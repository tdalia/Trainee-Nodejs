var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TraineePersonSchema = new Schema({
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    email: {type: String},
    gender: {type: String, required: true, enum: ['Male', 'Female', 'Other']},
    message: {type: String},
    experiencedTechno: {type: String}
});

// Virtual for author's full name
TraineePersonSchema
.virtual('name')
.get(function () {

// To avoid errors in cases where an trainee does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case

  var fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name
  }
  if (!this.first_name) {
    fullname = this.family_name + ', ';
  }
  if (!this.family_name) {
    fullname = ', ' + this.first_name
  }

  return fullname;
});

// Virtual for trainee's URL
TraineePersonSchema
.virtual('url')
.get(function () {
  return '/trainee/' + this._id;
});

// Virtual for dob_formatted
TraineePersonSchema
.virtual('dob_formatted')
.get(function() {
  return this.date_of_birth ? moment(this.date_of_birth).format('YYYY MMM DD') : '';
});

//Export model
module.exports = mongoose.model('TraineePerson', TraineePersonSchema);