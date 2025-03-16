import Job from "./Document";
import Wrapper from "../assets/wrappers/JobsContainer";
import { useAllJobsContext } from "../pages/AllDocs";

const JobsContainer = () => {
  const { data } = useAllJobsContext();
  const { jobs } = data;
  
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No Documents to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
    </Wrapper>
  );
};

export default JobsContainer;
