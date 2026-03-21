const cron = require('node-cron');
const Exam = require('../models/Exam');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

const initCronJobs = () => {
    // Schedule task: runs every 5 minutes (to avoid overloading but still catch the 1-hour mark accurately)
    cron.schedule('*/5 * * * *', async () => {
        console.log('--- [Cron] Checking for upcoming Exam Reminders (1 Hour Window)... ---');
        try {
            const now = new Date();
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // exactly 1 hour later
            const sixtyFiveMinutesFromNow = new Date(now.getTime() + 65 * 60 * 1000); // range buffer

            // Find published exams that start in roughly 1 hour and haven't sent reminders
            const upcomingExams = await Exam.find({
                status: 'published',
                reminderSent: false,
                startTime: {
                    $gte: oneHourFromNow,
                    $lte: sixtyFiveMinutesFromNow
                }
            }).populate('assignedStudents.user');

            console.log(`--- [Cron] Checking... Found ${upcomingExams.length} exams needing reminders. ---`);

            if (upcomingExams.length === 0) return;

            upcomingExams.forEach(async (exam) => {
                console.log(`[Cron] Reminding ${exam.assignedStudents.length} students for: ${exam.title}`);
                
                const emailTasks = exam.assignedStudents.map(asst => {
                    const studentUser = asst.user;
                    if (studentUser && studentUser.email) {
                        console.log(`[Cron] Reminder going to: ${studentUser.email}`);
                        const subject = `⚠️ FINAL REMINDER: ${exam.title} starts in 1 hour!`;
                        const text = `Hello ${studentUser.name},\n\nGet ready! Your exam starts in exactly 1 hour.\n\n` +
                            `Exam: ${exam.title}\n` +
                            `Topic: ${exam.subject}\n` +
                            `Start Time: ${exam.startTime.toLocaleTimeString()}\n\n` +
                            `Ensure you have a stable internet connection and are logged in to the platform before the start time.\n\nGood luck!`;
                        
                        return sendEmail({ to: studentUser.email, subject, text });
                    }
                });

                await Promise.all(emailTasks);
                
                // Mark as sent to prevent duplicate reminders in next cron run
                exam.reminderSent = true;
                await exam.save();
            });

        } catch (error) {
            console.error('[Cron] Error in reminder job:', error);
        }
    });

    console.log('[Info] Parixa Background Reminder Cron Job Initialized (Checks every 5 minutes).');
};

module.exports = { initCronJobs };
