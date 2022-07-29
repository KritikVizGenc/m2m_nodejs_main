const express = require("express");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {


    const { name, email, password } = req.body;

    const userWithEmail = await User.findOne({ where: { email } }).catch((err) => {
        console.log("Error ", err)

    });

    if(!userWithEmail)
        return res.json({ message: 'Email or password does not match!' });
    
    if(userWithEmail.password !== password)
        return res.json({ message: 'Email or password does not match!' });
    
    const jwtToken = jwt.sign({ id: userWithEmail.id, email: userWithEmail.email }, process.env.JWT_SECRET);

    res.status(200).json({userWithEmail, message: 'merhaba' + ' ' + name, token: jwtToken }); 

})

router.delete('/deleteUser/:id', async (req, res) => {


    const user = await User.destroy({ where: { id: req.params.id } })
    

    
    if(!user)
        return res.json({ message: 'User could not found' });
    
    

    res.status(200).json({ message: 'Successful'  }); 

})


module.exports = router;