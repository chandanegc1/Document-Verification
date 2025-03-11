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
import { action as RegisterAction } from "./pages/HRRegister";
import { action as LoginAction } from "./pages/Login";
import { loader as DashboardLoader } from "./pages/DashboardLayout";
import AddDocs, { action as AddDocsAction } from "./pages/AddDocs";
import AllDocs, { loader as allDocsloader } from "./pages/AllDocs";

import { action as deleteJobAction } from "./pages/DeleteDocs";

import { loader as adminLoader } from "./pages/Admin";
import { action as profileAction } from "./pages/Profile";
import HRlogin from "./pages/HRlogin";
import AllDocuments, {
  loader as allUserDocLoader,
} from "./pages/TableCandidates";
import UserDocsContainer, {
  loader as UserDocLoader,
} from "./components/UserDocsContainer";
import CDRegister, { action as CDaction } from "./pages/CDRegister";
import OTPVerification from "./utils/Otp";
import { useEffect, useState } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        element: <Register />,
        action: RegisterAction,
      },
      {
        path: "hr-login",
        element: <HRlogin />,
        action: RegisterAction,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        loader: DashboardLoader,
        children: [
          {
            index: true,
            action:AddDocsAction,
            element: <AddDocs />,
          },
          {
            path: "all-docs",
            element: <AllDocs />,
            loader: allDocsloader,
          },
          {
            path: "all-users-docs",
            element: <AllDocuments />,
            loader: allUserDocLoader,
          },
          {
            path: "cd-register",
            element: <CDRegister />,
            action: CDaction,
          },

          {
            path: "profile",
            element: <Profile />,
            action: profileAction,
          },
          {
            path: "admin",
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: "user-docs/:id",
            element: <UserDocsContainer />,
            loader: UserDocLoader,
          },
          {
            path: "delete-job/:id",
            action: deleteJobAction,
          },
          {
            path: "opt",
            element: <OTPVerification />,
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
        action: LoginAction,
      },
    ],
  },
]);

const App = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkRole = () => {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    };
    checkRole();
    const handleStorageChange = () => {
      checkRole();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <RouterProvider
      router={router}
      fallbackElement={<div>Loading...</div>}
    >
      <DashboardContent role={role} />
    </RouterProvider>
  );
};

const DashboardContent = ({ role }) => {
  if (role === "admin") {
    return <AllDocuments />;
  } else if (role === "user") {
    return <AddDocs />;
  } else {
    return <div>Loading role...</div>;
  }
};

export default App;
