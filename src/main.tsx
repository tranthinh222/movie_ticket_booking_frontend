import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home.tsx";
import Theater from "./pages/Theater.tsx";
import Promotion from "./pages/Promotion.tsx";
import Movie from "./pages/Movie.tsx";
import News from "./pages/News.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Payment from "./pages/Payment.tsx";
import Booking from "./pages/Booking.tsx";
import Profile from "./pages/Profile.tsx";
import BookingHistory from "./pages/BookingHistory.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";
import VerifyOTP from "./pages/VerifyOTP.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AuthProvider from "./components/context/AuthProvider.tsx";
import "./styles/global.css";
import MovieDetail from "./pages/MovieDetail.tsx";
import UserManagement from "./pages/admin/UserManagement.tsx";
import TheaterManagement from "./pages/admin/TheaterManagement.tsx";
import ShowtimeManagement from "./pages/admin/ShowtimeManagement.tsx";
import FilmManagement from "./pages/admin/FilmManagement.tsx";
import AddressManagement from "./pages/admin/AddressManagement.tsx";
import BookingManagement from "./pages/admin/BookingManagement.tsx";
import AuditoriumManagement from "./pages/admin/AuditoriumManagement.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";

import PaymentSuccess from "./pages/PaymentSuccess.tsx";
import PaymentFailure from "./pages/PaymentFailure.tsx";
import GeneralError from "./pages/GeneralError.tsx";
import Unauthorized from "./pages/Unauthorized.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "theater",
        element: <Theater />,
      },
      {
        path: "promotion",
        element: <Promotion />,
      },
      {
        path: "movie",
        element: <Movie />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "movie/:id",
        element: <MovieDetail />,
      },
      {
        path: "movie/:id/booking",
        element: (
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        ),
      },
      {
        path: "booking/:movieId",
        element: (
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "booking-history",
        element: (
          <ProtectedRoute>
            <BookingHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOTP />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/payment",
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment-failure",
    element: <PaymentFailure />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "theaters",
        element: <TheaterManagement />,
      },
      {
        path: "showtimes",
        element: <ShowtimeManagement />,
      },
      {
        path: "films",
        element: <FilmManagement />,
      },
      {
        path: "addresses",
        element: <AddressManagement />,
      },
      {
        path: "bookings",
        element: <BookingManagement />,
      },
      {
        path: "auditoriums",
        element: <AuditoriumManagement />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
