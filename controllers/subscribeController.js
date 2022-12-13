const Subscribe = require('../models/subscribe');
const asynchandler = require('express-async-handler');
const { sendEmail } = require('../utils/sendEmail');

/**
 * @desc Subscribe for updates
 * @method POST
 * @route /v1/sub/subscribe
 * @access Public
 */

const subscribe = asynchandler(async (req, res) => {
    //  get subscribed email
    try {
      const { email } = req.body;
  
      const userExist = await Subscribe.findOne({ email });
  
      if (userExist) {
        res.status(400).json({
            success: false,
            message:'Email already in use',
        })
      }
  
      const user = await Subscribe.create({
        email,
      });
      if (user) {
        user.subscribed = true;
        const subscribeUser = await user.save();
        res.status(200).json({
            success:true,
            message: 'Email has sucessfully subscribed',
            subscribeUser
        });
        if (user.subscribed === true) {
            const text = `<h1>Hello</h1>
            <p>You are receiving this email because you have 
            been successfully subscribed to Teller updates.</p>
            <h2><i>Congratulations, Tellerite</i></h2>
            </div>`;

            await sendEmail({
                email: user.email,
                subject: 'Teller Mail Subscription',
                message: text,
            });
        }
      }
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  /**
 * @desc UnSubscribe for updates
 * @method DELETE
 * @route /v1/sub/unsubscribe
 * @access Public
 */

  const unsubscribe = asynchandler(async(req,res) => {
    try {
        const { email } = req.body;
        const user = await Subscribe.findOne({email});
        if (!user) {
            return res.status(404).json({error:"Email not found"});
        }
        else{
           await user.deleteOne({email});
        res.status(200).json({
            message: "Unsubscribed successfully"
        });
            const text = `<h1>Hello</h1>
            <p>You Unsubscribed from Teller, you will miss our updates!.</p>
            <h2><i>Love and Light</i></h2>
            </div>`;
            
            await sendEmail({
                email:user.email,
                subject: 'Unsubscribed Succesfully',
                message: text,
            });
        }
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
  })

module.exports = {
    subscribe,
    unsubscribe
}