import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Import routes
import jobsRouter from "./api/routes/jobs";

app.use("/api/jobs", jobsRouter);

app.use("*", (req, res) => {
  return res.send("No url found");
});

app
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
  .on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is already in use, trying another port.`);
      const newPort: number = parseInt(port.toString()) + 1;
      app.listen(newPort, () => {
        console.log(`Server now running on port ${newPort}`);
      });
    } else {
      console.error("An error occurred: ", err);
    }
  });
