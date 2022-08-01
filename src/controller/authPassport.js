const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get('/icerideDeneme', passport.authenticate("jwt", { session: false }), (req, res) => {
    if(req.headers.cookie) {
        return res.json('İçeridesin...')
     }
     else
        return res.json('giriş yapmalısın')
    
})

module.exports = router;