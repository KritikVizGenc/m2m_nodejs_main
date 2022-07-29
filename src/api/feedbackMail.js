const express = require("express");

const sendEmail = require("../helpers/sendMail");

const router = express.Router();

router.post('/postFeedBack', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message; 
    const feedBackCategory = req.body.feedBackCategory;
    
    try {
      await sendEmail({
        from: name,
        to: process.env.TO_MAIL,
        subject: "FeedBack Form Mesajı",
        html: `<p>Name: ${name}</p><p>Email: ${email}</p><h1>Category: ${feedBackCategory}</h1><h3>Message: ${message}</h3>`,
      });
      return res.status(200).json({
        success: true,
        message: "Thanks for feedBack :))",
      });
    } catch (err) {
      console.log(err);
    }
  });

  module.exports = router;