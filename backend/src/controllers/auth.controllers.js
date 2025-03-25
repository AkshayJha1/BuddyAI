const User = require('../models/user.model');

const signUp = async (req , res) => {
    const { fullName , email , password } = req.body;

    if(!fullName || !email || !password) return res.status(400).json({ message: "All fields are required" });

    if(!email.includes('@')) return res.status(400).json({ message: "Enter email correctly" });

    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    
    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const newUser = new User({
            fullName,
            email,
            password,
        });

        if(newUser){
            const token = await newUser.generateAuthToken();
            if(!token) return res.status(400).json({ message : "Unable to generate Token"})

            res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // MS
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks
            sameSite: "strict", // CSRF attacks cross-site request forgery attacks
            secure: process.env.NODE_ENV !== "development",
            });

            await newUser.save();
            
            return res.status(200).json({message : "SignUp Successful" , token : token})
        }else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const login = async(req,res) => {
    const { email , password } = req.body;

    if(!email || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message: "Email does not exists" });

        const token = await user.generateAuthToken();
        if(!token) return res.status(400).json({ message : "Unable to generate Token"})

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // MS
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks
            sameSite: "strict", // CSRF attacks cross-site request forgery attacks
            secure: process.env.NODE_ENV !== "development",
        });

        return res.status(200).json({message : "login Successful" , token : token})
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const logout = (req, res) => {
    try {
      
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ message: "Logged out successfully" });
  
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { signUp , login , logout}