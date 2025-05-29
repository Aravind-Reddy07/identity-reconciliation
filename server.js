import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0');
