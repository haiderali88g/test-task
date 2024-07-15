import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";
import JobItem from "./JobItem";
import { Job } from "../types";

interface JobListProps {
  jobs: Job[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-5 bg-white">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="bg-blue-500 text-white font-bold">
                ID
              </TableCell>
              <TableCell className="bg-blue-500 text-white font-bold">
                Created At
              </TableCell>
              <TableCell className="bg-blue-500 text-white font-bold">
                Status
              </TableCell>
              <TableCell className="bg-blue-500 text-white font-bold">
                Result
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length > 0 ? (
              jobs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((job) => <JobItem key={job.id} job={job} />)
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center bg-gray-100 text-gray-500"
                >
                  <Typography variant="subtitle1">No data available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={jobs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="bg-white"
      />
    </div>
  );
};

export default JobList;
