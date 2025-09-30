const mongoose = require('mongoose');

const scheduleSlotSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentBatch',
    required: true
  }
});

const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  timeSlots: [{
    time: {
      type: String,
      required: true
    },
    slot: scheduleSlotSchema
  }]
});

const timetableSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Approved', 'Pending Review'],
    default: 'Draft'
  },
  generatedDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  schedule: [dayScheduleSchema],
  preferences: {
    maxHoursPerDay: {
      type: Number,
      default: 6
    },
    breakDuration: {
      type: Number,
      default: 60
    },
    workingDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    startTime: {
      type: String,
      default: '09:00'
    },
    endTime: {
      type: String,
      default: '17:00'
    }
  },
  constraints: {
    facultyUnavailability: {
      type: String,
      default: ''
    },
    roomRestrictions: {
      type: String,
      default: ''
    },
    specialRequirements: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timetable', timetableSchema);