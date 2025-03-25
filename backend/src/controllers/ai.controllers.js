const jwt = require('jsonwebtoken');
const { generateResult } = require('../services/ai.services');
const User = require('../models/user.model');

const getResult = async (req, res) => {
    try {
        const { message } = req.body;
        const result = await generateResult(message , req);

        const token = req.cookies.jwt;
        if(token){
            const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
            const user = await User.findById(decoded.userId)
            if(user){
                user.conversations.push({
                    sender: "user",
                    message: message,
                    createdAt: new Date(),
                });
        
                user.conversations.push({
                    sender: "ai",
                    message: result, // The AI's response
                    createdAt: new Date(),
                });
        
                await user.save();  
        }
        }
        
        return res.status(200).json({result});
    } catch (error) {
        res.status(500).send({ "error" : error.message });
    }
}

module.exports = { getResult }