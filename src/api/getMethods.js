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
//favfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfav
router.post('/favMentorAdd/:mentorId', async (req, res) => {
    try {
      const { mentorId } = req.params;
      const userId = req.body.userId;
      const result = await Mentee_fav_mentor.findOne({
        where: { user_id: mentorId, fav_id: userId}
      });
      

        if(userId == mentorId) { 
          res.status(402).json("You can't favor yourself...")
        }else {
          if (!result) {
               await Mentee_fav_mentor.create({ user_id: mentorId, fav_id: userId, include: {
                model: User
              }});

              const results = await Mentee_fav_mentor.findOne({
                where: { user_id: mentorId,fav_id: userId}, include: [
                    { model: User, as: 'favMentors'}
                  ]
              });
            

            res.status(200).json({
              Favorite: true,
              msg: `Mentor added to your favorites list: ${results.favMentors.name}  ${results.favMentors.surname}`,
            });
        } else {
          await Mentee_fav_mentor.destroy({ where: result.dataValues });
          res.status(200).json({
            Favorite: false,
            msg: `Mentor removed from your favorite list`,
          });
        }}
        }catch (error) {
      res.status(500).json({ error: { msg: 'Error changing favorite status' } });
      
    }
  });
  
/////////////////////////////////get Favorite///////////////

router.get('/favMentor/:menteeId', async (req, res) => {
    try {
      const { menteeId } = req.params;
      const result = await Mentee_fav_mentor.findAll({
        where: { user_id: menteeId }, include: [
            { model: User, as: 'favMentors'}
          ],raw: true,
       
      });

      console.log(result)
  
      if (result) {
        res.status(200).json(result);;
      } else {
        res.status(200).json({
          Favorite: false,
          msg: `Mentee has not made a Favorite yet:${result}`,
        });
      }
    } catch (error) {
      res.status(500).json({ error: { msg: 'Error getting Favorite Status' } });
    }
  });
////////////////////////delete Favorite////////////////
router.delete('/favMentorDelete/:id',   async (req, res) => {

    const user = await Mentee_fav_mentor.destroy({ where: { id: req.params.id } })
   
    if(!user)
        return res.status(404).json({ message: 'My favorite could not found' });
    
    res.status(200).json({ message: 'Successful'  }); 

})


module.exports = router;
