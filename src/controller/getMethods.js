const express = require("express");
const {User,Role,USER_HAS_ROLE,TAG_TABLE,USER_HAS_TAG,Comments,Meetings, } = require("../models/user");
const jwt = require('jsonwebtoken');
const auth = require('../controller/auth');
const { Op } = require("sequelize");
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



router.get('/getAll/limit=:limits/offset=:offsets', async (req, res) => {

    const user = await User.findAll({limit:req.params.limits, offset:req.params.offsets});
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})

router.get('/getById/:userId', async (req, res) => {

    const user = await User.findAll({ where: { id: req.params.userId } })

    if(!user){
       return res.status(404).json({message: 'hatalı'})
    }
    return res.status(200).json(user);
})



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
     console.log(user.user_tables)
    res.status(200).json(user.user_tables);

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

/////Comments Operations/////
// CREATE Comment
router.post('/addComment', async (req,res) => {   
    const { comment_content,owner_id,author_id} = req.body; 
    const newComment = new Comments({  comment_content,owner_id,author_id,include:[{model:User}]});
    const savedComment = await newComment.save().catch((err) => {
        console.log("Error: ", err)
        res.status(404).json({error: "Cannot add a comment   at the moment!"})
    
    })

    if(savedComment){

        res.status(201).json({newComment});
    }


})

router.get('/getComment/:ownerId', async (req, res) => {
    const comments = await Comments.findAll({ where: { owner_id: req.params.ownerId} ,include:[{model:User,as :'author_comments',attributes:[
        "id",
        "name",
        "surname",
        "user_role"
    ]
    }],raw:true})
    if(!comments){
       return res.status(404).json({message: 'hatalı'})
    }
    return res.status(200).json(comments);
})

router.post('/createMeet/:createdByid', async (req,res) => {   
    
    const { mentee_id,meeting_date, start_time,end_time,message} = req.body; //tablodan çekilecek veriler
    const alreadyExistMeeting = await Meetings.findOne({ where: { start_time } }).catch((err) => {
        console.log(err)
    });
    if(alreadyExistMeeting){
        return res.status(404).json({ message: "Users have already meetings at that date!! ",start_time})
    };


    let createdById = req.params.createdByid;
    const newMeeting = new Meetings({  mentee_id,meeting_date, start_time, end_time, message ,createdById,include:[{model:User}]});
    const savedMeeting = await newMeeting.save().catch((err) => {
        console.log("Error: ", err)
        res.status(404).json({error: "Cannot set a meeting   at the moment!"})
    
    })

    if(savedMeeting){

        res.status(201).json({newMeeting});
    }


})
router.get('/getMeeting', async (req, res) => {

    const meeting = await Meetings.findAll();
    if(!meeting){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(meeting);
})

/*router.get('/getMeeting/:meetingId', async (req, res) => {
    const meeting = await Meetings.findByPk(req.params.meetingId);
    if(!meeting){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(meeting);
})*/
router.get('/getMeeting/:createdById', async (req, res) => {
    const meeting = await Meetings.findAll({ where:{createdById: req.params.createdById},include:[{model:User,as :'mentees',attributes:[
        "id",
        "name",
        "surname",
        "user_role"
    ]
    },{model:User,as:'mentor',attributes:[
        "id",
        "name",
        "surname",
        "user_role"
    ]}],raw:true});
    if(!meeting){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(meeting);
})

router.put('/updateMeeting/:id', async (req, res) => {

    const meetCheck = await Meetings.findOne({where: {id: req.params.id}})
  
        const meet = await Meetings.update({ mentee_name:req.body.mentee_name,mentee_surname:req.body.mentee_surname, meeting_date:req.body.meeting_date,start_time:req.body.start_time, end_time:req.body.end_time, message:req.body.message},
            {where: {id: req.params.id }})
            
        

            if(!meetCheck){
               return res.status(404).json({message:"yok", MeetingVarMi})
            }
           return res.status(200).json({ message: 'Updated', meet }); 
})
router.delete('/deleteMeeting/:id', async (req, res) => {

    const meeting = await Meetings.destroy({ where: { id: req.params.id } })
   
   
    
    if(!meeting)
        return res.status(404).json({ message: 'Meeting could not found' });
    
    res.status(200).json({ message: 'Successful'  }); 

})

router.get('/getTopUsers',async(req,res)=>{
    const user = await User.findAll({where:{ratingAverage:{[Op.gt]:3}}});

    if(user){

        return res.status(200).json(user);

    }

    return res.status(404).json({message:'There are no users with rating.Please rate someone!'});

})


module.exports = router;