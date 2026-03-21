const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const test = async () => {
    // Generate a valid token for a student
    // Need a real student ID from the database
    const mongoose = require('mongoose');
    const User = require('./models/User');
    await mongoose.connect(process.env.MONGO_URI);
    
    const student = await User.findOne({ role: 'student' });
    if (!student) {
        console.log("No student found");
        process.exit();
    }
    
    console.log(`Simulating login for: ${student.email}`);
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    try {
        const res = await axios.get('http://localhost:5000/api/exams/my-assigned-exams', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("API Result Status:", res.status);
        console.log("API Result Data:", JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error("API Error:", err.response ? err.response.data : err.message);
    }
    
    process.exit();
};
test();
