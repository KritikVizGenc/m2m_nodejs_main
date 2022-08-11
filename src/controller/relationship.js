const express = require("express");
const {User, MENTOR_MENTEE_REL} = require("../models/user");

const router = express.Router();

router.post('/reqMentor/:mentorId', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const userId = req.body.userId;
    const result = await MENTOR_MENTEE_REL.findOne({
      where: { user_id: mentorId, rel_id: userId}
    });
    if(userId == mentorId) { 
      res.status(402).json("You cannot request to yourself...")
    }else {
    if (!result) {
         await MENTOR_MENTEE_REL.create({ user_id: mentorId, rel_id: userId, include: {
          model: User
        }});

        const results = await MENTOR_MENTEE_REL.findOne({
          where: { user_id: mentorId,rel_id: userId}, include: [
              { model: User, as: 'myMentees'},
              { model: User, as: 'myMentors'}
            ]
        });
       

      res.status(200).json({
        follow: true,
        msg: `Mentor has been successfully followed: ${results.myMentors.name}  ${results.myMentors.surname}`,
      });
    } else {
      await MENTOR_MENTEE_REL.destroy({ where: result.dataValues });
      res.status(200).json({
        follow: false,
        msg: `Mentor has been successfully unfollowed`,
      });
    }
  } }catch (error) {
    res.status(500).json({ error: { msg: 'Error in changing follow status' } });
  }
});

router.get('/myMentees/:mentorId', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const result = await MENTOR_MENTEE_REL.findAll({
      where: { rel_id: mentorId }, include: [
          { model: User, as: 'myMentees'}, 
        ],raw: true,
        
    
    })

    console.log(result)

    if (result) {
      res.status(200).json(result);

    } else {
      res.status(200).json({
        follow: false,
        msg: `user is not following user id:${result}`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: { msg: 'Error in retrieving status' } });
  }
});



router.get('/myMentors/:menteeId', async (req, res) => {
  try {
    const { menteeId } = req.params;
    const result = await MENTOR_MENTEE_REL.findAll({
      where: { user_id: menteeId }, include: [
          { model: User, as: 'myMentors'}
        ],raw: true,
     
    });

    console.log(result)

    if (result) {
      res.status(200).json(result);;
    } else {
      res.status(200).json({
        follow: false,
        msg: `user is not following user id:${result}`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: { msg: 'Error in retrieving status' } });
  }
});
  module.exports = router;