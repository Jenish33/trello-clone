import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import usersRouter from "./routes/users.js"
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

//Database Connection
const MONGODB_URI = 'mongodb+srv://admin:root@cluster0.ra8z0cr.mongodb.net/';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("Connected to the Database")
})
.catch((err)=>{
    console.log("Database Connection failed: ", err)
})

//Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', usersRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})