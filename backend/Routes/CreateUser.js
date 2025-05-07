const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const axios = require('axios');
const fetch = require('../middleware/fetchdetails');
const jwtSecret = "HaHa";

// Creating a user and storing data to MongoDB Atlas, No Login Required
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
    body('name', 'Name must be at least 3 characters long').isLength({ min: 3 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        let securePass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email,
            location: req.body.location
        });

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, jwtSecret);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error);
        // Handle Mongoose validation errors (e.g., missing required fields)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, errors: messages });
        }
        // For other errors, return the actual message
        res.status(500).json({ success: false, error: error.message });
    }
});

// Authenticating a User, No login Required
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, jwtSecret);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: "Server Error" });
    }
});

// Get logged-in User details, Login Required
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Get location details, No login Required
router.post('/getlocation', async (req, res) => {
    try {
        const { lat, long } = req.body.latlong;
        console.log(lat, long);

        const location = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`)
            .then(res => {
                const response = res.data.results[0].components;
                const { village, county, state_district, state, postcode } = response;
                return `${village}, ${county}, ${state_district}, ${state}\n${postcode}`;
            })
            .catch(error => {
                console.error(error);
                throw new Error("Failed to fetch location data");
            });

        res.json({ location });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
