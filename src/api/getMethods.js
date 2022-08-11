const express = require("express");
const User = require("../models/user");
const Role = require("../models/user")
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/getAll', async (req, res) => {

    const users = await User.findAll();
    res.json(users);
})


router.get('/getAll/:id/limit=:side/offset=:offsets', async (req, res) => {

    
    const users = await User.findAll({where: { user_role: req.params.id}, offset:req.params.offsets, limit: req.params.side });
    res.json(users);
})



router.get('/getById/:id', async (req, res) => {

    const user = await User.findAll({ where: { id: req.params.id } })
    res.json(user);
})


router.get('/getByRole/:id', async (req, res) => {

    const user = await Role.findAll({ where: { user_role: req.params.id } })

    
    res.json(user);

})

router.get('/getByRole/:id/:name', async (req, res) => {

    const user = await Role.findAll({ where:{user_role: req.params.id , name: req.params.name }},)
    res.json(user);
})


module.exports = router;
