const express = require('express');
const auth = require('./auth')
const authPassport = require('./authPassport')
const getMethods = require('./getMethods')
const feedbackMail = require('./feedBackMail')
const ratingAll = require('./ratingAll')
const relationship = require('./relationship')
const bcrypt = require('bcrypt');


const router = express.Router();

router.use(auth)
router.use(authPassport)
router.use(getMethods)
router.use(feedbackMail)
router.use(ratingAll)
router.use(relationship)

module.exports = router;
