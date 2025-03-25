const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    fullName :{
        type:String, 
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    conversations: [
        {
            sender: {
                type: String,
                enum: ["user", "ai"], // Restricts to "user" or "ai"
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now, // Adds a timestamp for messages
            },
        } 
    ]
},{ timestamps: true })

userSchema.pre("save", async function(next){       //The pre method ensures that data save hone se phle iske ander ka defined function execute hona chaiye
    const user = this; //here this store all the values of req.body + id    

    if(!user.isModified("password")){
        next();
    }

    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password , saltRound);
        user.password = hash_password;
    } catch (error) {
        next(error);
    }
});

userSchema.methods.pwdCompare = async function(password) { // Compare the provided password with the hashed password using model method
    try {

        const isUser  = await bcrypt.compare(password, this.password); 
        return isUser ; 
    } catch (error) {
        console.error('Error during password comparison:', error);
    }
};

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign(
            { 
              userId : this._id.toString(),
              email : this.email,
            }
           , process.env.JWT_SECRET_KEY, 
            {
            expiresIn: "7d",
            }
        );
        
        return token;
    } catch (error) {
        console.error(error);
    }
}

const User = mongoose.model('User' , userSchema);
module.exports = User;
