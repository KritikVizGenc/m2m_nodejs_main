const express = require('express');
const registerApi = require('./register')
const loginApi = require('./login')
const icerideDenemeApi = require('./icerideDeneme')
const getAll = require('./getAll')

const router = express.Router();

router.use(registerApi)
router.use(loginApi)
router.use(icerideDenemeApi)
router.use(getAll)

module.exports = router;
