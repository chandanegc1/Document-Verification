import { Link, Form, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/Job";
import day from "dayjs";
import { FormRowSelect } from "../components";
import { JOB_STATUS } from "../../../utils/constants";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

day.extend(advancedFormat);

const Job = ({ _id, documentName, number, avatar, status, id }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "hr";
  const actionFun = async (newStatus) => {
    try {
      await customFetch.put(`/jobs/${_id}`, { jobStatus: newStatus });
      toast.success("Job status updated successfully");
      navigate(`../user-docs/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update job status");
    }
  };

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{documentName.charAt(0)}</div>
        <div className="info">
          <h5>{documentName}</h5>
          <p>{number}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <img
            src={avatar}
            alt={documentName}
            height="250px"
            style={{
              display: "block",
              margin: "0 auto",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
        <footer className="actions">
          <p className={`btn edit-btn ${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
          <Form method="post" action={`../delete-job/${_id}`}>
            {!isAdmin ? (
              <button type="submit" className="btn delete-btn">
                Delete
              </button>
            ) : (
              <a href={avatar} download className="btn delete-btn">
                Download
              </a>
            )}
          </Form>{" "}
          &nbsp;&nbsp;
          {isAdmin && (
            <FormRowSelect
              name="jobStatus"
              labelText="Job Status"
              defaultValue={status}
              onChange={(value) => actionFun(value)} // Pass the new status to actionFun
              list={Object.values(JOB_STATUS)}
            />
          )}
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
