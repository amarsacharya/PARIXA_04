require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online-exam';

mongoose.connect(MONGO_URI)
    .then(async () => {
        const result = await User.deleteMany({ role: { $ne: 'admin' } });
        console.log(`Deleted ${result.deletedCount} non-admin users to prepare for class migration.`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
