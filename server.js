const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
require('dotenv').config()
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const signupSchema = require("./models/signupModel");
const { error } = require('console');

const app = express();


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Register API
app.post("/register", async (req, res) => {
    try {
        const { fullname, employeeId, email, password, dateOfBirth } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new signupSchema({
            fullname,
            employeeId,
            email,
            password: hashPassword,
            dateOfBirth
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login API

app.post("/login", async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        const user = await signupSchema.findOne({ employeeId })
        if (!user) {
            res.statu(400).json("User not found")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json("Password is incorrect");
        }
        res.status(200).json("Sucess");
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("MongoDB Connected");
    }).catch((err) => {
        console.log(err)
    })

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});