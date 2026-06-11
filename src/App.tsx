import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useStore from "./store/useStore";
import Layout from "./components/Layout";
import ThreadView from "./pages/ThreadView";

/**
 * Root application component
 * Sets up routing, theme management, and initializes data fetching
 */
function App() {
  const { darkMode, fetchNotes, fetchBranches } = useStore();

  // Initialize app by fetching notes and branches from IPC
  useEffect(() => {
    fetchNotes();
    fetchBranches();
  }, []);

  // Apply or remove dark mode class to document root
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ThreadView />} />
          <Route path="/branch/:branchId" element={<ThreadView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
