const express = require("express");
const {User} = require("../models/user")
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

router.put('/updateUser/:id', async (req, res) => {



    const user = await User.update({name:req.body.name, surname:req.body.surname, email:req.body.email, user_role:req.body.user_role},
         {where: {id: req.params.id } })

    if(!user.id)
        return res.status(404).json({ message: 'User could not found' });


    res.status(200).json({ message: 'Updated' }); 

})

router.delete('/deleteUser/:id', async (req, res) => {


    const user = await User.destroy({ where: { id: req.params.id } })
    

    
    if(!user)
        return res.json({ message: 'User could not found' });
    
    

    res.status(200).json({ message: 'Successful'  }); 

})


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