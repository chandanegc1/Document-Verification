import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { Link, useLoaderData } from "react-router-dom";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/user/all-users");
    return data.users;
  } catch (error) {
    console.error(error);
    toast.error(error.message);
    return [];
  }
};

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
    renderCell: (params) => (
      <Link to={`/dashboard/user-docs/${params.row._id}`}>{params.row.id}</Link>
    ),
  },
  {
    field: "_id",
    headerName: "Employee ID",
    width: 200,
    renderCell: (params) => (
      <Link to={`/dashboard/user-docs/${params.row._id}`}>
        {params.row.employeeId || "N/A"}
      </Link>
    ),
  },
  {
    field: "name",
    headerName: "Full Name",
    sortable: false,
    width: 200,
    renderCell: (params) => (
      <div id="table-row-data">
        {params.row.avatar && <img src={params.row.avatar} alt="avatar" />}
        <Link to={`/dashboard/user-docs/${params.row._id}`}>
          <p>{params.row.name || "N/A"}</p>
        </Link>
      </div>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    renderCell: (params) => (
      <Link to={`/dashboard/user-docs/${params.row._id}`}>
        {params.row.email || "N/A"}
      </Link>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
    renderCell: (params) => (
      <Link to={`/dashboard/user-docs/${params.row._id}`}>
        {params.row.status ? (
          <p style={{ color: "green" }}>Completed</p>
        ) : (
          <p style={{ color: "red" }}>Pending</p>
        )}
      </Link>
    ),
  },
];

export default function DataTable() {
  const data = useLoaderData();
  const filterData = data.filter((item) => item.role === "user");
  const rows = filterData.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  return (
    <Paper sx={{ height: "80vh", width: "100%", cursor: "pointer" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 25, 50, 100]} 
        paginationModel={{ pageSize: rows.length, page: 0 }} // Show all rows
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
