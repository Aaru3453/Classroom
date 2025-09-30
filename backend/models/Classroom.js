const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  building: {
    type: String,
    required: true
  },
  equipment: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Available', 'Unavailable', 'Maintenance'],
    default: 'Available'
  },
  type: {
    type: String,
    enum: ['Lecture Hall', 'Seminar Room', 'Workshop', 'Lab', 'Computer Lab', 'Conference Room'],
    required: true
  },
  department: {
    type: String,
    default: 'General'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Classroom', classroomSchema);