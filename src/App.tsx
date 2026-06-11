import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useStore from "./store/useStore";
import Layout from "./components/Layout";
import ThreadView from "./pages/ThreadView";

function App() {
  const { darkMode, fetchNotes, fetchBranches } = useStore();

  useEffect(() => {
    fetchNotes();
    fetchBranches();
  }, []);

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
