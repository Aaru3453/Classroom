require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const classrooms = require('./routes/classrooms');
const faculty = require('./routes/faculty');
const subjects = require('./routes/subjects');
const batches = require('./routes/batches');
const timetables = require('./routes/timetables');
const reports = require('./routes/reports');
const notifications = require('./routes/notifications');
const dashboard = require('./routes/dashboard');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Compression middleware
app.use(compression());
//remove krna hai
// Add test route before your main API routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is connected!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
})

// Mount routers - MAKE SURE THESE LINES ARE PRESENT
app.use('/api/auth', auth);


app.use('/api/users', users);
app.use('/api/classrooms', classrooms);
app.use('/api/faculty', faculty);
app.use('/api/subjects', subjects);
app.use('/api/batches', batches);
app.use('/api/timetables', timetables);
app.use('/api/reports', reports);
app.use('/api/notifications', notifications);
app.use('/api/dashboard', dashboard);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Handle undefined routes - This is what's showing "Route not found"
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    availableRoutes: [
      '/api/auth/*',
      '/api/users/*',
      '/api/classrooms/*',
      '/api/faculty/*',
      '/api/subjects/*',
      '/api/batches/*',
      '/api/timetables/*',
      '/api/reports/*',
      '/api/notifications/*',
      '/api/test'
    ]
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;



