const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");

// Start express app
const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // one proxy hop (e.g., load balancer)
}

// 1) GLOBAL MIDDLEWARES
// Implement fine-grained CORS (wildcard * cannot be used with credentials)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options(/.*/, cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting (configurable via env, relaxed defaults for dev)
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX, 10) || (process.env.NODE_ENV === 'development' ? 1000 : 300);
const RATE_LIMIT_WINDOW_MINUTES = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 60; // minutes
const limiter = rateLimit({
  max: RATE_LIMIT_MAX,
  windowMs: RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: `Too many requests from this IP, please try again after the rate limit window.`
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());


// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users", userRouter);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
