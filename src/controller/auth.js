const express = require("express");
const {User, USER_HAS_TAG} = require("../models/user")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authPassport = require('./authPassport');
const passport = require('../auth/passport');
const bodyParser = require('body-parser');
const fs = require('fs');
const mime = require('mime');
const { route } = require("./authPassport");


const router = express.Router();


router.post('/login', async (req, res) => {


    const { name, email, password } = req.body;

    const userWithEmail = await User.findOne({ where: { email } }).catch((err) => {
        console.log("Error ", err)

    });
    if(!userWithEmail)
    return res.status(404).json({ message: 'Email or password does not match!' });

    const isPasswordCorrect = bcrypt.compareSync(
        password,
        userWithEmail.password
      );
    
    if(!isPasswordCorrect)
        return res.status(404).json({ message: 'Email or password does not match!' });

   
    const jwtToken = jwt.sign({ id: userWithEmail.id, email: userWithEmail.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie('token', jwtToken, { maxAge: 900000, httpOnly: true });

    if(req.headers.cookie) {
        return res.status(404).json({message: "zaten loginsiniz..."})
     }

    res.status(200).json({userWithEmail, message: 'Welcome to M2M ' + ' ' + name, token: jwtToken }); 

})

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());


router.put('/updateUser/:id',  async (req, res) => {

    const userCheck = await User.findOne({where: {id: req.params.id}})
    
        const user = await User.update({name:req.body.name, surname:req.body.surname, email:req.body.email, user_role:req.body.user_role,avatar:req.body.avatar,about_me:req.body.about_me,city:req.body.city},
            {where: {id: req.params.id }})
            
        

            if(!userCheck){
               return res.status(404).json({message:"yok", userVarMi})
            }
           return res.status(200).json({ message: 'Updated', user }); 
     

})
router.post("/chooseTag/:user_id", async(req,res) =>{

    //const userCheck = await User.findOne({where: {id: req.params.id}})
    
    const newTag = new USER_HAS_TAG({user_id:req.params.user_id,tag_id: req.body.tag_id})

    const savedTag = await newTag.save().catch((err) => {
        console.log("Error: ", err)
        res.status(404).json({error: "You cannot choose the same tag.Please choose another one !"})    
    })

   if(savedTag){
        
        res.status(201).json({newTag}); 
    }
})


router.delete('/deleteUser/:id',authPassport,   async (req, res) => {

    const user = await User.destroy({ where: { id: req.params.id } })
   
   
    
    if(!user)
        return res.status(404).json({ message: 'User could not found' });
    
    res.status(200).json({ message: 'Successful'  }); 

})


router.post("/register", async (req,res) => {   
    
    const { name, surname, email, password, user_role } = req.body;
    
    
    const alreadyExistUser = await User.findOne({ where: { email } }).catch((err) => {
        console.log(err)
    }); 

    
    if(alreadyExistUser){
        return res.status(404).json({ message: "User with email already exists! ",email})
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ name, surname, email, password: hashedPassword, user_role });
    

    const savedUser = await newUser.save().catch((err) => {
        console.log("Error: ", err)
        res.status(404).json({error: "Cannot register user at the momnet!"})
        
    })

    if(savedUser){
        const jwtToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          res.cookie('token', jwtToken, { maxAge: 900000, httpOnly: true }); 

        res.status(201).json({newUser, token: jwtToken }); 

    }
})

router.post("/logout",authPassport, async (req,res) => {   
    
    if(!req.headers.cookie) {
       return res.status(404).json({message: "giriş yapmadınız ki çıkasınız.."})
    }
    
    res.clearCookie('token')
    res.status(200).json({message:"Successfully Logged Out"})
});




module.exports = router;