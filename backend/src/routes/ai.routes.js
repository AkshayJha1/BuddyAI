const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middlewares/authenticateUser.middlewares');

const aiController = require('../controllers/ai.controllers');

router.post('/get-result', aiController.getResult)

module.exports = router;