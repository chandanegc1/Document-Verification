import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  Admin,
  Profile,
} from "./pages";
import { action as LoginAction } from "./pages/Login";
import { loader as DashboardLoader } from "./pages/DashboardLayout";
import AddDocs, { action as AddDocsAction } from "./pages/AddDocs";
import AllDocs, { loader as allDocsLoader } from "./pages/AllDocs";
import { action as deleteJobAction } from "./pages/DeleteDocs";
import { loader as adminLoader } from "./pages/Admin";
import { action as profileAction } from "./pages/Profile";
import HRlogin from "./pages/HRlogin";
import { action as HRloginAction } from "./pages/HRlogin";
import AllDocuments, { loader as allUserDocLoader } from "./pages/TableCandidates";
import UserDocsContainer, { loader as UserDocLoader } from "./components/UserDocsContainer";
import CDRegister, { action as CDaction } from "./pages/CDRegister";
import { useEffect, useState } from "react";
import OTPverification from "./pages/OTPverification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Landing /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login />, action: LoginAction },
      { path: "hr-login", element: <HRlogin />, action: HRloginAction },
      { path: "otp-verify", element: <OTPverification />, action: LoginAction },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        loader: DashboardLoader,
        children: [
          { index: true, action: AddDocsAction, element: <AddDocs /> },
          { path: "all-docs", element: <AllDocs />, loader: allDocsLoader },
          { path: "all-users-docs", element: <AllDocuments />, loader: allUserDocLoader },
          { path: "cd-register", element: <CDRegister />, action: CDaction },
          { path: "profile", element: <Profile />, action: profileAction },
          { path: "admin", element: <Admin />, loader: adminLoader },
          { path: "user-docs/:id", element: <UserDocsContainer />, loader: UserDocLoader },
          { path: "delete-job/:id", action: deleteJobAction },
        ],
      },
    ],
  },
]);

const App = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "guest");

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role") || "guest");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />;
};

export default App;
