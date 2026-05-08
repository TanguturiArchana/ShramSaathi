import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Admin/Navbar";
import Home from "./components/Admin/Home";
import Stats from "./components/Admin/Stats";
import Opening from "./components/Admin/Opening";
import FAQ from "./components/Admin/Faq";
import Footer from "./components/Admin/Footer";


import WorkerDashboard from "./components/Worker/WorkerDashboard";
import OwnerLayout from "./components/Owner/OwnerLayout";
import JobManager from "./components/Owner/JobManager";
import Analytics from "./components/Owner/Analytics";
import ApplicationsPanel from "./components/Owner/ApplicationsPanel";
import OwnerProfile from "./components/Owner/OwnerProfile";
import WorkerProfile from "./components/Worker/WorkerProfile";



import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, 
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <Routes>
        
        <Route
          path="/"
          element={
            <div className="landing-shell">
              <Navbar />
              <Home />
              <Stats />
              <Opening />
              <FAQ />
              <Footer />
            </div>
          }
        />

        
        <Route path="/workerDashboard" element={<WorkerDashboard />} />
        <Route path="/WorkerProfile" element={<WorkerProfile />} />

       
        <Route element={<OwnerLayout />}>
          
          <Route path="/ownerDashboard" element={<Navigate to="/owner/jobs" />} />
          <Route path="/owner/jobs" element={<JobManager />} />
          <Route path="/owner/analytics" element={<Analytics />} />
          <Route path="/owner/applications" element={<ApplicationsPanel />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />

        </Route>
      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;