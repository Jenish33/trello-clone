import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Sample route
router.get('/check', async (req, res) => {
    res.send("I am working man");
})

router.post('/register', async (req, res) => {
    const {name, email, password } = req.body
    // split the email after "@" and before ".com" and make it as new const domain
    const domain = email.split("@")[1].split(".")[0];
    console.log(domain)

    //Check if the user already existed
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({error: 'Email already registered'})
        }

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            domain
        })

        //save user to database
        const savedUser = await newUser.save();

        res.status(201).json({ message: 'User Registered Successfully' })
    } 
    catch(error){
        res.status(500).json({ message: `An error occured while Registering : ${error}`, })
    }
})

//login user

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        //Check if the user already existed
        const user = await User.findOne({ email });
        console.log(user)
        if(!user){
            return res.status(401).json({error: 'Invalid Email or username'})
        }
        //compare the password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log(isPasswordCorrect)
        if(!isPasswordCorrect){
            return res.status(401).json({error: 'Invalid password'})
        }
        // Generate a JWT Token
        console.log("first")
        console.log(process.env.JWT_SECRET)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
        console.log(token)

        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "An Error occured while trying to Login"})
    }
});

//Get User detaials
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try{
        const user = await User.findById(userId).select('-password')
        if(!user){
            return res.status(401).json({error: "User not found"});
        }
        res.json(user);
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ message: "Error occured while getting the User" })
    }
})

// Update user details
router.put('/:userId', async (req, res) => {
    const userId = req.params
    const {name, email} = req.body
    try{
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email},
            { new: true}
        ).select('-password');
        if(!updatedUser) {
            return res.status(404).json({error: "User not found"})
        }

        res.json(updatedUser)
    }
    catch (error){
        return res.status(500).json({error: "Error while updating the user details"})
    }
})
// Delete User
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser){
            return res.status(404).json({error: "User not found"})
        }

        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({error: "An error occured while deleting the user"})
    }
})

export default router;