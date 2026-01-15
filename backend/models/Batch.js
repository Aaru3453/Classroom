const mongoose = require('mongoose');

const semesterSubjectSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }
});

const semesterSchema = new mongoose.Schema({
  semesterNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  name: {
    type: String,
    required: true
  },
  subjects: [semesterSubjectSchema],
  startDate: Date,
  endDate: Date
});

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a batch name'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please add a batch code'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please add a department']
  },
  academicYear: {
    type: String,
    required: [true, 'Please add academic year']
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  semesters: [semesterSchema],
  startYear: {
    type: Number,
    required: true
  },
  endYear: {
    type: Number,
    required: true
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Batch', batchSchema);