const express = require("express");
const User = require("../models/user")
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post("/register", async (req,res) => {   
    
    const { name, surname, email, password, user_role } = req.body;
    
    
    const alreadyExistUser = await User.findOne({ where: { email } }).catch((err) => {
        console.log(err)
    }); 

    if(alreadyExistUser){
        return res.json({ message: "User with email already exists! ",email})
    }

    
    const newUser = new User({ name, surname, email, password, user_role });
    

    const savedUser = await newUser.save().catch((err) => {
        console.log("Error: ", err)
        res.json({error: "Cannot register user at the momnet!"})
        
    })

    if(savedUser){
        const jwtToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET);

        res.status(201).json({newUser, token: jwtToken }); 

    }
})

module.exports = router;