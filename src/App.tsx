import { Outlet } from "react-router";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

const App: React.FC = () => {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default App;
