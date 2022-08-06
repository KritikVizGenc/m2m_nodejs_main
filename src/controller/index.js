const express = require('express');
const auth = require('./auth')
const authPassport = require('./authPassport')
const getMethods = require('./getMethods')
const feedbackMail = require('./feedbackMail')
const relationship = require('./relationship')
const rating = require('./ratingAll')
const bcrypt = require('bcrypt');


const router = express.Router();

router.use(auth)
router.use(authPassport)
router.use(getMethods)
router.use(feedbackMail)
router.use(relationship)
router.use(rating)

module.exports = router;
