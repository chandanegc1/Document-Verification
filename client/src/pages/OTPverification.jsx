import { FormRow } from "../components";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { useNavigate, useNavigation } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useState } from "react";

const Register = ({ data }) => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      await customFetch.post(`/auth/otp-verification`, {
        email: data.email,
        otp: otp,
      });
      const res2 = await customFetch.post("/auth/register-hr", data);
      setLoader(false);
      toast.success(res2.data.msg);
      navigate("/hr-login");
    } catch (error) {
      toast.error(error.response.data.msg);
      setLoader(false);
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit} className="form">
        <FormRow
          type="otp"
          name="name"
          labelText="Enter OTP"
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-block form-btn">
          {loader ? "Submitting.." : "Submit"}
        </button>
      </form>
    </Wrapper>
  );
};
export default Register;
