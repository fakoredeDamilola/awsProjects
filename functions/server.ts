import app from './app';
import { connectDB } from './dbConnection';

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
