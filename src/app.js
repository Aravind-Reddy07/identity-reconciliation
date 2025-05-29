import express from "express";
import identifyRoutes from "./routes/Identify.route.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(express.json());
app.use("/", identifyRoutes);
app.use(errorHandler);

export default app;
