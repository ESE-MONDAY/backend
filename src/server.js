import express from 'express';
import { connectToDatabase, disconnectFromDatabase } from './config/db.js';
import v1Routes from './routes/v1/index.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 5001;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectToDatabase();
app.use('/api/v1', v1Routes);



app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// ... rest of your shutdown handlers


// Handle graceful shutdown
process.on("SIGTERM", async () => {
    console.log("Received SIGTERM. Shutting down gracefully...");
    server.close(async () => {
        console.log("HTTP server closed.");
        await disconnectFromDatabase();
        process.exit(0);
    });
    
});

// Unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    server.close(async () => {
        console.log("HTTP server closed.");
        await disconnectFromDatabase();
        process.exit(0);
    });
});

// Uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);    
    server.close(async () => {
        console.log("HTTP server closed.");
        await disconnectFromDatabase();
        process.exit(1); // Exit with a failure code
    });
});