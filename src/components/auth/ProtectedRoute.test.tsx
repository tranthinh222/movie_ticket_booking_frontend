import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuth } from "../../store/useAuth";
import ProtectedRoute from "./ProtectedRoute";

const Unauthorized = () => {
  const location = useLocation();
  return <p>unauthorized from {(location.state as { from?: Location })?.from?.pathname}</p>;
};

const renderRoute = () => render(
  <MemoryRouter initialEntries={["/private"]}>
    <Routes>
      <Route path="/private" element={<ProtectedRoute><p>secret</p></ProtectedRoute>} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  </MemoryRouter>,
);

describe("ProtectedRoute integration", () => {
  beforeEach(() => useAuth.setState({ user: null, authenticated: false, isLoading: false }));

  it("renders a loading state while account restoration is pending", () => {
    useAuth.setState({ isLoading: true });
    renderRoute();
    expect(screen.getByText("Đang kiểm tra quyền truy cập...")).toBeInTheDocument();
  });

  it("redirects guests and preserves their original location", () => {
    renderRoute();
    expect(screen.getByText("unauthorized from /private")).toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
    useAuth.setState({ authenticated: true });
    renderRoute();
    expect(screen.getByText("secret")).toBeInTheDocument();
  });
});
