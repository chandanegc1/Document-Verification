import { Link, Form } from "react-router-dom";
import Wrapper from "../assets/wrappers/Job";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
day.extend(advancedFormat);

const Job = ({ _id, documentName, number, avatar, status }) => {
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
            height={"300px"}
            style={{
              display: "block",
              margin: "0 auto",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
        <footer className="actions">
          <Link to={`../edit-job/${_id}`} className={`btn edit-btn ${status}`}>
            {status === "approved"
              ? "Approved"
              : status === "rejected"
              ? "Rejected"
              : "Pending"}
          </Link>
          <Form method="post" action={`../delete-job/${_id}`}>
            <button type="submit" className="btn delete-btn">
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  );
};
export default Job;
