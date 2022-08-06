const express = require("express");
const {User,Role,USER_HAS_ROLE,PERMISSION_TABLE,TAG_TABLE,USER_HAS_INFO,USER_HAS_TAG,USER_INFORMATION,Meetings} = require("../models/user");
const jwt = require('jsonwebtoken');

const router = express.Router();


router.get('/getAll', async (req, res) => {

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

router.get('/getTags/:tagId', async (req, res) => {

    const user = await USER_INFORMATION.findAll({ where: { tag_id: req.params.tagId }, include: {
        model: TAG_TABLE,
        through: "user_has_tags",
        as: "tag_table", 
      } })

    if(!user){
       return res.status(404).json({message: 'bu ada sahip bir kullanıcı bulunamadı'})
    }
    return res.status(200).json(user);
})
router.get('/getTagToInfo/:tag', async (req, res) => {

    const user = await TAG_TABLE.findAll({ where: { tag_name: req.params.tag }, include: {
        model: USER_INFORMATION,
        
      } })

    if(!user){
       return res.status(404).json({message: 'bu ada sahip bir kullanıcı bulunamadı'})
    }
    return res.status(200).json(user);
})

router.get('/getInfo/:info', async (req, res) => {

    const user = await User.findAll({ where: { id: req.params.info }, include: {
        model: USER_INFORMATION,
        
      } })

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

    const user = await User.findOne({ where: { id: req.params.userId } })

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


/////Meeting operations////

router.post('/meet', async (req,res) => {   
    
    const { mentee_name,mentee_surname,meeting_date, start_time,end_time,message} = req.body; //tablodan çekilecek veriler
    const alreadyExistMeeting = await Meetings.findOne({ where: { start_time } }).catch((err) => {
        console.log(err)
    });
    if(alreadyExistMeeting){
        return res.status(404).json({ message: "Users have already meetings at that date!! ",start_time})
    };


    const newMeeting = new Meetings({  mentee_name,mentee_surname,meeting_date, start_time, end_time, message });
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

module.exports = router;
