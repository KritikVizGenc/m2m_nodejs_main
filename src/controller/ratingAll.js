const express = require("express");
const {User} = require("../models/user")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require("sequelize");

const router = express.Router();

router.put('/rate/:mId', async (req, res) => {

    const { mId } = req.params;
    const { rating } = req.body;

        const user = await User.update({'rating': sequelize.fn('array_append', sequelize.col('rating'), rating)},
            {where: {id: mId }})

            const findUser = await User.findOne(
                {where: {id: mId }})

            var sum = 0;
                for (var number of findUser.rating) {
                    sum += number;
                }
                average = sum / findUser.rating.length;


    res.status(200).json({findUser}); 

})



router.get('/ratingScore/:mId', async (req, res) => {

    const { mId } = req.params;
    const { rating } = req.body;


            const findUser = await User.findOne(
                {where: {id: mId }})

            var sum = 0;
                for (var number of findUser.rating) {
                    sum += number;
                }
                average = sum / findUser.rating.length;


    res.status(200).json( {message: `${average.toFixed(1)}`}); 

})

module.exports = router;