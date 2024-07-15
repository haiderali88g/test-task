import { Router } from "express";
import { createJob, getJobs, getJobById } from "../controllers/jobsController";

const router = Router();

router.post("/", createJob);
router.get("/", getJobs);
router.get("/:jobId", getJobById);

export default router;
