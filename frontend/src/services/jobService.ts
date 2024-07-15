import axios from "axios";
import { Job } from "../types";

const BASE_URL = process.env.REACT_APP_API_URL as string;
if (!BASE_URL) {
  throw new Error("REACT_APP_API_URL must be set");
}

export const createJob = async (): Promise<Job> => {
  const response = await axios.post(BASE_URL);
  return response.data;
};

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const fetchJobById = async (jobId: string): Promise<Job> => {
  const response = await axios.get(`${BASE_URL}/${jobId}`);
  return response.data;
};
