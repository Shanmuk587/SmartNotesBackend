const express = require('express');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const app = express();
const noteRoutes=require('./routes/noteRoutes')
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // React app origin
    credentials: true,
    sameSite: 'Lax', // allow cookies to be sent
  }));

app.use('/api/notes', noteRoutes);

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Hi! The server is running");
});

// Routes
app.use('/api/auth', authRoutes);

// Error handler middleware (should be last)
app.use(errorHandler);

module.exports = app;