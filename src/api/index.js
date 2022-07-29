const express = require('express');
const registerApi = require('./register')
const loginApi = require('./login')
const icerideDenemeApi = require('./icerideDeneme')
const getMethods = require('./getMethods')
const feedbackMail = require('./feedbackMail')


const router = express.Router();

router.use(registerApi)
router.use(loginApi)
router.use(icerideDenemeApi)
router.use(getMethods)
router.use(feedbackMail)

module.exports = router;
