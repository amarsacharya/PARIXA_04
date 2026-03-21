const express = require('express');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Route: POST /api/admin/register
// Desc : Admin registers a new student or teacher
// Note : Protected so only authenticated Admins can access it
router.post('/register', protect, adminOnly, async (req, res) => {
    try {
        const { name, email, role, assignedClass } = req.body;

        // Validation limits to student or teacher
        if (!['student', 'teacher'].includes(role)) {
            return res.status(400).json({ message: 'Role must be student or teacher.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        // The password strategy based on user request
        let rawPassword;
        if (role === 'student') {
            rawPassword = 'student123';
        } else if (role === 'teacher') {
            // Generate an 8 character random string for teachers
            rawPassword = Math.random().toString(36).slice(-8);
        }

        // Send email with the raw password before we hash it and save to MongoDB
        const subject = `Welcome to the Platform - Your Current Initial Credentials!`;
        const text = `Hello ${name},\n\nYou have been registered as a ${role}.\n\nYour login email is: ${email}\nYour initial password is: ${rawPassword}\n\nPlease log in and change your password in your profile immediately.`;
        
        // Wait for the email to send before continuing
        await sendEmail({ to: email, subject, text });

        // Create the user in MongoDB. Upon creation, the internal User model 
        // hook will use bcrypt to ENCRYPT 'rawPassword' before it's actually recorded.
        const user = await User.create({
            name,
            email,
            password: rawPassword,
            role,
            assignedClass: assignedClass || 'Unassigned',
        });

        res.status(201).json({
            message: `${role} registered successfully. Credentials sent via email.`,
            userId: user._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating user' });
    }
});

// Route: POST /api/admin/register-bulk
// Desc : Admin bulk-registers students/teachers from a list
router.post('/register-bulk', protect, adminOnly, async (req, res) => {
    try {
        const { users } = req.body; // Array of { name, email, role }
        if (!users || !Array.isArray(users)) {
            return res.status(400).json({ message: 'Invalid payload. "users" must be an array.' });
        }

        console.log(`[Admin] Processing bulk registration for ${users.length} users...`);
        const results = [];
        for (const u of users) {
           try {
                const userExists = await User.findOne({ email: u.email });
                if (userExists) {
                    results.push({ email: u.email, status: 'error', message: 'User already exists' });
                    continue;
                }

                const role = u.role || 'student';
                const rawPassword = role === 'student' ? 'student123' : Math.random().toString(36).slice(-8);

                await User.create({
                    name: u.name,
                    email: u.email,
                    password: rawPassword,
                    role,
                    assignedClass: u.assignedClass || 'Unassigned'
                });

                // Optional: Send email (keeping it async for speed but careful with rate limits)
                sendEmail({ 
                    to: u.email, 
                    subject: `Welcome to ParixaAI - Your Portals Entry Credentials`, 
                    text: `Hello ${u.name},\n\nYou have been registered as a ${role}.\nPortal: http://localhost:5173\nEmail: ${u.email}\nInitial Password: ${rawPassword}` 
                }).catch(e => console.error(`Email fail for ${u.email}`, e));

                results.push({ email: u.email, status: 'success' });
           } catch (err) {
                results.push({ email: u.email, status: 'error', message: err.message });
           }
        }

        res.json({ message: 'Bulk registration complete', details: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during bulk registration' });
    }
});

// Route: GET /api/admin/users
// Desc : Admin gets list of all users
// Note : Protected so only authenticated Admins can access it
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// Route: PUT /api/admin/users/:id
// Desc : Admin updates a user's details
router.put('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const { name, email, role, assignedClass } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.assignedClass = assignedClass || user.assignedClass;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating user' });
    }
});

// Route: DELETE /api/admin/users/:id
// Desc : Admin deletes a user entirely
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Use deleteOne() instead of remove() for Mongoose 6+
        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'User removed completely' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting user' });
    }
});

module.exports = router;
