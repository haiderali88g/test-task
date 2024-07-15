export interface Job {
  id: string;
  status: "Pending" | "Completed" | "Failed";
  result?: string;
  createdAt: Date;
}
