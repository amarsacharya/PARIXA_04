const mongoose = require('mongoose');
const Exam = require('./models/Exam');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected.');

        const students = await User.find({ role: 'student' });
        console.log(`System has ${students.length} students.`);

        for (const student of students) {
            console.log(`\n--- Checking student: ${student.email} ---`);
            const assignments = await Exam.find({ 'assignedStudents.user': student._id });
            console.log(`Direct Match Count: ${assignments.length}`);
            assignments.forEach(e => {
                const asst = e.assignedStudents.find(a => a.user.toString() === student._id.toString());
                console.log(`  - Exam: ${e.title} | Set: ${asst ? asst.setNumber : 'N/A'} | UserType: ${asst ? typeof asst.user : 'N/A'} | Status: ${e.status} | Starts at: ${e.startTime.toISOString()}`);
            });
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};
check();
