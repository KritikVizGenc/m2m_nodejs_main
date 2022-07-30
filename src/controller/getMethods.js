const express = require("express");
const {User,Role,USER_HAS_ROLE} = require("../models/user");
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/getAll', async (req, res) => {

    const users = await User.findAll();
    res.json(users);
})

router.get('/getAll/limit=:limits/offset=:offsets', async (req, res) => {

    const users = await User.findAll({limit:req.params.limits, offset:req.params.offsets});
    res.json(users);
})

router.get('/getById/:userId', async (req, res) => {

    const user = await User.findAll({ where: { id: req.params.userId } })
    res.json(user);
})

router.get('/getByRole', async (req, res) => {

    
    const user = await Role.findAll({ include: User} );
  
    res.json(user);

})

router.get('/getByRole/:roleName', async (req, res) => {

    
    const user = await Role.findAll({where: {role_name: req.params.roleName}, include: User} );
  
    res.json(user);

})


router.get('/getByRole/:roleName/limit=:limits', async (req, res) => {

    
    const user = await Role.findAll({where: { role_name: req.params.roleName} , include: User, limit:req.params.limits});
    res.json(user);
})

router.get('/getByRole/:roleName/:id', async (req, res) => {

    const user = await Role.findAll({ where:{role_name: req.params.roleName , id: req.params.id },  include: User },)
    res.json(user);
})



module.exports = router;