const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get('/icerideDeneme', passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send('─░├žeridesin...')
})

module.exports = router;