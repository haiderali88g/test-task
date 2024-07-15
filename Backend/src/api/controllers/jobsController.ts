import { Request, Response } from "express";
import * as jobsService from "../services/jobService";

export const createJob = async (req: Request, res: Response) => {
  try {
    const job = await jobsService.createJob();
    res.status(201).json({ jobId: job.id, status: job.status });
  } catch (error) {
    res.status(500).json({ message: "Error creating job" });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await jobsService.listJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error listing jobs" });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await jobsService.getJob(req.params.jobId);
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving job" });
  }
};
