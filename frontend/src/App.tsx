import React, { useEffect, useState } from "react";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import { fetchJobs } from "./services/jobService";
import { Job } from "./types";
import { Typography, Grid } from "@mui/material";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [continuePolling, setContinuePolling] = useState(true);

  const refreshJobs = async () => {
    const updatedJobs = await fetchJobs();
    setJobs(updatedJobs);

    // Check if any jobs are still pending
    const hasPendingJobs = updatedJobs.some((job) => job?.status === "Pending");
    setContinuePolling(hasPendingJobs);
  };

  useEffect(() => {
    refreshJobs(); // Initial fetch
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (continuePolling) {
      intervalId = setInterval(refreshJobs, 5000); // Set up the interval
    }

    return () => clearInterval(intervalId); // Cleanup interval
  }, [continuePolling]);

  return (
    <div className="App" style={{ padding: 20 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        padding="20px"
      >
        <Typography variant="h4" component="h2">
          Job Management System
        </Typography>
        <JobForm onJobCreate={refreshJobs} />
      </Grid>
      <JobList jobs={jobs} />
    </div>
  );
}

export default App;
