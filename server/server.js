import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import path from 'path';

dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();

// Database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Database connected"))
.catch((err) => console.log("DB connection error =>", err));

// Middlewares
app.use(morgan('dev'));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
    origin: '*',  // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"],  // Allow these headers
}));

// Autoload Routes
const routesPath = path.join(__dirname, 'routes');

readdirSync(routesPath).map((file) => {
    if (file.endsWith('.js')) {
        import(path.join(routesPath, file)).then(route => {
            app.use('/api', route.default);
        }).catch(err => {
            console.error(`Failed to import route file ${file}:`, err);
        });
    }
});

// Route handler for /api/hello endpoint
app.get('/api/hello', (req, res) => {
    res.send('Hello server');
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        console.log(err); // Log the error object
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
});

// Start server and display message upon successful start
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
    console.log(`Visit http://localhost:${port}/ to access the application.`);
});
