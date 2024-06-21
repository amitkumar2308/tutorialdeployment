import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
import { readdirSync } from 'fs';
import morgan from 'morgan';
import dotenv from 'dotenv';


dotenv.config();

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
app.use(cors({
    origin: ["http://localhost:3000"],
}));

// Autoload Routes
(async () => {
    for (const file of readdirSync('./routes')) {
        const route = await import(`./routes/${file}`);
        app.use('/api', route.default);
    }
})();

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        console.log(err); // Log the error object
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
});

// Listen
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running at port ${port}`));
