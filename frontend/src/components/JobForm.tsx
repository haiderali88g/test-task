import React, { useState } from "react";
import { createJob } from "../services/jobService";
import { Button, Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface JobFormProps {
  onJobCreate: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ onJobCreate }) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createJob();
      onJobCreate();
      setOpen(true); // Open the Snackbar upon success
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Button variant="contained" color="primary" type="submit">
          Create New Job
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Job created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default JobForm;
