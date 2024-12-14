import bcrypt from "bcrypt";  //to encrypt psw
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
          firstName,
          lastName,
          email,
          password,
          picturePath,
          friends,
          location,
          occupation,
        } = req.body;
    
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
    
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: passwordHash,
          picturePath,
          friends,
          location,
          occupation,
          viewedProfile: Math.floor(Math.random() * 10000),
          impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("login email, password",email, password);
        
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);  //secret-key : The server uses the secret key to verify that the token was indeed signed by it and has not been tampered with
        delete user.password;  //prevent passing to frontend
        res.status(200).json({ token, user });  //can use the token for authentication
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}