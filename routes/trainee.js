
var express = require('express');
var router = express.Router();

// Require controller modules.
var trainee_controller = require('../controllers/traineePersonController');

// TRAINEE ROUTES

// Get Trainees Home page
router.get('/', trainee_controller.index);

// GET request for list of all trainee items.
router.get('/trainees', trainee_controller.trainee_list);

// GET request for creating a trainee. NOTE This must come before routes that display trainee (uses id).
router.get('/create', trainee_controller.trainee_create_get);

// POST request for creating trainee.
router.post('/create', trainee_controller.trainee_create_post);

// GET request to delete trainee.
router.get('/:id/delete', trainee_controller.trainee_delete_get);

// POST request to delete trainee.
router.post('/:id/delete', trainee_controller.trainee_delete_post);

// GET request to update trainee.
router.get('/:id/update', trainee_controller.trainee_update_get);

// POST request to update trainee.
router.post('/:id/update', trainee_controller.trainee_update_post);

// GET request for one trainee.
router.get('/:id', trainee_controller.trainee_detail);



module.exports = router;