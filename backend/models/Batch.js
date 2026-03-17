// import mongoose from 'mongoose';

// const batchSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   code: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   department: {
//     type: String,
//     required: true
//   },
//   academicYear: {
//     type: Number,
//     required: true
//   },
//   currentSemester: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 8
//   },
//   startYear: {
//     type: Number,
//     required: true
//   },
//   endYear: {
//     type: Number,
//     required: true
//   },
//   totalStudents: {
//     type: Number,
//     default: 0
//   },
//   status: {
//     type: String,
//     enum: ['Active', 'Graduated', 'Inactive'],
//     default: 'Active'
//   }
// }, {
//   timestamps: true
// });

// const Batch = mongoose.model('Batch', batchSchema);
// export default Batch;  // Make sure this is here


import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  academicYear: {
    type: Number,
    required: true
  },
  currentSemester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
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

  // ✅ ADD THIS (IMPORTANT 🔥)
  semesters: [
    {
      semesterNumber: Number,
      subjects: [
        {
          subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
          }
        }
      ]
    }
  ],

  status: {
    type: String,
    enum: ['Active', 'Graduated', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Batch = mongoose.model('Batch', batchSchema);
export default Batch;