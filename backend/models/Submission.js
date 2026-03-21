const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    exam: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Exam', 
        required: true 
    },
    answers: [{
        question: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Question' 
        },
        selectedOption: Number // index (0, 1, 2, 3)
    }],
    score: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    proctoringLogs: [{
        timestamp: { type: Date, default: Date.now },
        violation: String, // "Multiple People Detected", "Mobile Phone Found", etc.
        threatLevel: { type: Number, default: 0 }, // 0 (Clean) to 10 (Critical)
        imageUrl: String // Store base64 or reference to proctored snapshot
    }],
    submittedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
