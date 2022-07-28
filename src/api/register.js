const express = require("express");
const User = require("../models/user")

const router = express.Router();

router.post("/register", async (req,res) => {

    const { fullName, email, password } = req.body;

    const alreadyExistUser = await User.findOne({ where: { email } }).catch((err) => {
        console.log(err)
    });

    if(alreadyExistUser){
        return res.json({ message: "User with email already exists! "})
    }
    
    const newUser = new User({ fullName, email, password });
    const savedUser = await newUser.save().catch((err) => {
        console.log("Error: ", err)
        res.json({error: "Cannot register user at the momnet!"})

    })

    if(savedUser){
        res.json({newUser})
    }
})

module.exports = router;