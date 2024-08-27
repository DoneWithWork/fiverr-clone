import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./App.tsx";
import Gigs from "./pages/Gigs.tsx";
import SellerDashboard from "./pages/SellerDashboard.tsx";
import BuyerDashboard from "./pages/BuyerDashboard.tsx";
import Register from "./pages/Register.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/gigs",
        element: <Gigs />,
      },
      {
        path: "/seller-dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "/buyer-dashboard",
        element: <BuyerDashboard />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
