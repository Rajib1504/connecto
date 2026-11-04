import express, { type NextFunction, type Request, type Response } from "express";
import AuthRouter from "./routes/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiError from "./utils/api-error";


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth", AuthRouter)

app.get("/", (req, res) => {
  res.send("Hello World!from Express");
});


// not found 
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});
app.all("{*path}", (req, res, next) => {
  next(ApiError.notfound(`Route ${req.originalUrl} not found`));
});



// Global Error Handler
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;