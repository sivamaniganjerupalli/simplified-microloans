import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Lender Pages
import LenderDashboard from "./pages/Lender/Dashboard";
import LenderLoans from "./pages/Lender/LenderLoans";
import LenderTransactions from "./pages/Lender/LenderTransactions";
import LenderSettings from "./pages/Lender/LenderSettings";
import LenderProfile from "./pages/Lender/LenderProfile";
import LenderHelp from "./pages/Lender/LenderHelp";

// Vendor Pages
import VendorDashboard from "./pages/Vendor/Dashboard";
import VendorLoans from "./pages/Vendor/VendorLoans";
import VendorTransactions from "./pages/Vendor/VendorTransactions";
import VendorSettings from "./pages/Vendor/VendorSettings";
import VendorProfile from "./pages/Vendor/VendorProfile";
import VendorHelp from "./pages/Vendor/VendorHelp";
import LoanRequestForm from "./pages/Vendor/LoanRequestForm";


// Auth & Common Pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyOtp from "./pages/Auth/VerifyOTP";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Lender Dashboard Routes */}
        <Route path="/lender" element={<DashboardLayout />}>
          <Route index element={<LenderDashboard />} />
          <Route path="loans" element={<LenderLoans />} />
          <Route path="transactions" element={<LenderTransactions />} />
          <Route path="settings" element={<LenderSettings />} />
          <Route path="profile" element={<LenderProfile />} />
          <Route path="help" element={<LenderHelp />} />
        </Route>

        {/* Vendor Dashboard Routes */}
        <Route path="/vendor" element={<DashboardLayout />}>
          <Route index element={<VendorDashboard />} />
          <Route path="loans" element={<VendorLoans />} />
          <Route path="transactions" element={<VendorTransactions />} />
          <Route path="settings" element={<VendorSettings />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="help" element={<VendorHelp />} />
          <Route path="request-loan" element={<LoanRequestForm />} />

        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
