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
import NewGig from "./components/NewGig.tsx";
import Gig from "./pages/Gig.tsx";
import OrdersSeller from "./pages/OrdersSeller.tsx";
import OrdersBuyer from "./pages/OrdersBuyer.tsx";
import Pay from "./pages/Pay.tsx";
import CompletePage from "./components/CompletePage.tsx";
import OrderBuyerInvididual from "./pages/OrderBuyerInvididual.tsx";
import SingleUser from "./pages/IndividualUser.tsx";
import Messages from "./pages/Messages.tsx";
import IndividualMessage from "./pages/Message.tsx";
import MyGigs from "./pages/MyGigs.tsx";

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
        path: "/gig/:id",
        element: <Gig />,
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
      {
        path: "/newgig",
        element: <NewGig />,
      },
      {
        path: "/mygigs",
        element: <MyGigs />,
      },
      {
        path: "/seller-dashboard/orders",
        element: <OrdersSeller />,
      },
      {
        path: "/buyer-dashboard/orders",
        element: <OrdersBuyer />,
      },
      {
        path: "/pay/:id",
        element: <Pay />,
      },
      {
        path: "/success",
        element: <CompletePage />,
      },
      {
        path: "/orders",
        element: <OrdersBuyer />,
      },
      {
        path: "/orders/:id",
        element: <OrderBuyerInvididual />,
      },
      {
        path: "/user/:id",
        element: <SingleUser />,
      },
      //chat routes
      {
        path: "/messages",
        element: <Messages />,
      },
      {
        path: "/messages/:id",
        element: <IndividualMessage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
