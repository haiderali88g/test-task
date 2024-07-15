import { promises as fs } from "fs";
import axios from "axios";
import path from "path";
import lockfile from "proper-lockfile";
import { v4 as uuidv4 } from "uuid";

// Define a type for Job
interface Job {
  id: string;
  status: "Pending" | "Completed" | "Failed";
  result?: string; // URL of the fetched image
  createdAt: Date;
}

// Path to the jobs file
const jobsFilePath: string = path.join(__dirname, "../..", "jobs.json");

// Function to initialize the jobs file if it doesn't exist
async function initializeJobsFile(): Promise<void> {
  try {
    await fs.access(jobsFilePath);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      await fs.writeFile(jobsFilePath, JSON.stringify({}), "utf8");
    } else {
      throw error; // Rethrow the error if it's not related to the file being non-existent
    }
  }
}

// Function to read jobs from file
async function readJobsFromFile(): Promise<Record<string, Job>> {
  await initializeJobsFile();
  const data = await fs.readFile(jobsFilePath, "utf8");
  return JSON.parse(data);
}

// Function to write jobs to file
async function writeJobsToFile(jobs: Record<string, Job>): Promise<void> {
  await fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2), "utf8");
}

// Function to create a new job
export const createJob = async (): Promise<Job> => {
  const jobs = await readJobsFromFile();
  const jobId = uuidv4();
  const job: Job = {
    id: jobId,
    status: "Pending",
    createdAt: new Date(),
  };
  jobs[jobId] = job;
  await writeJobsToFile(jobs);

  // Start job execution asynchronously
  processJob(jobId);

  return job;
};

// Function to list all jobs
export const listJobs = async (): Promise<Job[]> => {
  const jobs = await readJobsFromFile();
  return Object.values(jobs);
};

// Function to get a specific job by ID
export const getJob = async (jobId: string): Promise<Job | null> => {
  const jobs = await readJobsFromFile();
  return jobs[jobId] || null;
};

const processJob = async (jobId: string) => {
  try {
    const delay = Math.random() * (5 * 60 * 1000); // Delay between 0 to 5 minutes
    setTimeout(async () => {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random?query=food&client_id=${process.env.UNSPLASH_CLIENT_ID}`,
        { responseType: "json" }
      );

      const imageUrl = response.data.urls.regular;

      // Lock, read, update, write, unlock
      await lockfile.lock(jobsFilePath);
      try {
        const jobs = await readJobsFromFile(); // Refresh the job data
        jobs[jobId].status = "Completed";
        jobs[jobId].result = imageUrl;
        await writeJobsToFile(jobs); // Write updated jobs
      } finally {
        await lockfile.unlock(jobsFilePath);
      }
    }, delay);
  } catch (error) {
    // Lock, read, update, write, unlock
    await lockfile.lock(jobsFilePath);
    try {
      const jobs = await readJobsFromFile(); // Refresh the job data
      jobs[jobId].status = "Failed";
      await writeJobsToFile(jobs); // Write updated jobs
    } finally {
      await lockfile.unlock(jobsFilePath);
    }
    console.error("Failed to process job:", jobId, error);
  }
};
