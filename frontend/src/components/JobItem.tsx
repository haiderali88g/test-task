import React from "react";
import { Job } from "../types";
import { TableCell, TableRow, Button } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

interface JobItemProps {
  job: Job;
}

const JobItem: React.FC<JobItemProps> = ({ job }) => {
  // Function to determine the color of the status icon
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "yellow";
      case "Completed":
        return "green";
      case "Failed":
        return "red";
      default:
        return "grey"; // Default case for unexpected statuses
    }
  };

  return (
    <TableRow className="hover:bg-gray-100">
      {" "}
      {/* Hover effect to change background color */}
      <TableCell component="th" scope="row">
        {job?.id}
      </TableCell>
      <TableCell>{new Date(job?.createdAt).toLocaleString()}</TableCell>
      <TableCell>
        <FiberManualRecordIcon
          style={{
            color: getStatusColor(job?.status),
            fontSize: "1rem",
            marginRight: "1rem",
          }}
        />
        {job.status}
      </TableCell>
      <TableCell>
        {job?.result ? (
          <a href={job.result} target="_blank" rel="noopener noreferrer">
            <Button variant="outlined" size="small">
              View Image
            </Button>
          </a>
        ) : (
          "N/A"
        )}
      </TableCell>
    </TableRow>
  );
};

export default JobItem;
