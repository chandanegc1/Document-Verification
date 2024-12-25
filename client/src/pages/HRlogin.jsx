import React, { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/HRlogin";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { images } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../utils/helper";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { signInApiCall } from "../utils/helper";
import { SmallLogo } from "../components/Logo";

const LoginPage = () => {
  const [randomIndex] = useState(Math.floor(Math.random() * images.length));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  //   useEffect(() => {
  //     const login = localStorage.getItem("login_credentials");
  //     if (login) navigate("/homepage");
  //   }, [navigate]);

  const handleSignin = async (data) => {
    const result = await signInApiCall(data);
    console.log(result);
    if (result) {
    //   navigate("/");
      localStorage.setItem("login_credentials", JSON.stringify(result));
    } else {
      setDialogMessage(
        "Failed to connect to the server. Please try again later."
      );
      setDialogOpen(true);
    }
  };

  const responseMessage = (response) => {
    try {
      if (!response.credential) {
        throw new Error("No credentials found in the response.");
      }
      const decoded = jwtDecode(response.credential);

      if (verifyEmail(decoded.email)) {
        const userData = {
          name: decoded.name,
          email: decoded.email,
          token: response.credential,
          picture: decoded.picture,
        };
        handleSignin(userData);
      } else {
        setDialogMessage(
          "Access restricted to GlobalLogic users and approved interns only."
        );
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("JWT Decode Error:", error);
      setDialogMessage("Failed to decode the response. Please try again.");
      setDialogOpen(true);
    }
  };

  const errorMessage = () => {
    console.error("Google Login failed");
    setDialogMessage("Google Login failed. Please try again.");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogMessage("");
  };

  return (
    <Wrapper>
      <div
        className="login-page"
        style={{ backgroundImage: images[randomIndex] }}
      >
        <div className="login-container">
          <div className="logo">
            <SmallLogo />
          </div>
          <div className="discription">
            <p>Human Resources Login</p>
          </div>
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Wrapper>
  );
};

export default LoginPage;
