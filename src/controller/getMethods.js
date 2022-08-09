const express = require("express");
const {User,Role,USER_HAS_ROLE,PERMISSION_TABLE,TAG_TABLE,USER_HAS_TAG} = require("../models/user");
const jwt = require('jsonwebtoken');
const auth = require('../controller/auth');
const { json } = require("body-parser");
const { model } = require("mongoose");
const router = express.Router();


router.get('/getAll', async (req, res,next) => {

    const user = await User.findAll();
    
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})

router.get('/getAll/:userName', async (req, res) => {

    const user = await User.findAll({ where: { name: req.params.userName } })

    if(!user){
       return res.status(404).json({message: 'bu ada sahip bir kullanıcı bulunamadı'})
    }
    return res.status(200).json(user);
})
router.get('/getAllTag', async (req, res,next) => {

    const user = await TAG_TABLE.findAll();
    
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})

router.get('/getTagbyUser',async(req,res)=>{

    const tags = await USER_HAS_TAG.findAll({include:[{model:User,as:'user_tag'},{model:TAG_TABLE,as:'tag_tag'}],raw:true});

    if(!tags){
        return res.status(404),json({message:'Unable to do this'})
    }

    res.status(200).json(tags);
})


router.get('/getTagID/:tag_id',async(req,res)=>{

    const tags = await USER_HAS_TAG.findAll({where:{tag_id:req.params.tag_id},include:[{model:TAG_TABLE,as:'tag_tag'},{model:User,as:'user_tag'}],raw:true });

    if(!tags){
        return res.status(404),json({message:'Unable to do this'})
    }

    res.status(200).json(tags);
})

router.get('/getTagbyUser/:user_id',async(req,res)=>{

    const tags = await USER_HAS_TAG.findAll({where:{user_id:req.params.user_id},include:[{model:User,as:'user_tag'},{model:TAG_TABLE,as:'tag_tag'}],raw:true});
    

    if(!tags){
        return res.status(404),json({message:'Unable to do this'})
    }

    res.status(200).json(tags); 

})



/*router.get('/getTags/:tagId', async (req, res) => {

    const user = await User.findAll({ where: { tag_id: req.params.tagId }, include: {
        model: TAG_TABLE,
        through: "user_has_tags",
        as: "tag_table", 
      } })

    if(!user){
       return res.status(404).json({message: 'bu ada sahip bir kullanıcı bulunamadı'})
    }
    return res.status(200).json(user);
})*/
/*router.get('/getTagToInfo/:tag', async (req, res) => {

    const user = await TAG_TABLE.findAll({ where: { tag_name: req.params.tag }, include: {
        model: User,
        
      } })

    if(!user){
       return res.status(404).json({message: 'bu ada sahip bir kullanıcı bulunamadı'})
    }
    return res.status(200).json(user);
})*/

router.get('/getAll/limit=:limits/offset=:offsets', async (req, res) => {

    const user = await User.findAll({limit:req.params.limits, offset:req.params.offsets});
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})

router.get('/getById/:userId', async (req, res) => {

    const user = await User.findOne({ where: { id: req.params.userId } })

    if(!user){
       return res.status(404).json({message: 'hatalı'})
    }
    return res.status(200).json(user);
})

/*router.get('/getTagbyId/:user_id', async(req,res) => {

    const tags = await USER_HAS_TAG.findOne({where: {user_id: req.params.user_id}})

    if(!tags){

        return res.status(404),json({message: 'unable to do this'})
    }

    return res.status(200),json(tags);


})*/


router.get('/getByRole', async (req, res) => {

    
    const user = await Role.findAll({ include: User} );
  
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
     return res.status(200).json(user);

})

router.get('/getByRole/:roleName', async (req, res) => {

    
    const user = await Role.findOne({where: {role_name: req.params.roleName}, include: User} );
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);

})


router.get('/getByRole/:roleName/limit=:limits', async (req, res) => {

    
    const user = await Role.findOne({where: { role_name: req.params.roleName} , include: User, limit:req.params.limits});
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})

router.get('/getByRole/:roleName/:id', async (req, res) => {

    const user = await Role.findOne({ where:{role_name: req.params.roleName , id: req.params.id },  include: User },)
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})



module.exports = router;