import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserProvider, parseEther } from "ethers";
import Button from "../../components/common/Button";

const LenderLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);

  const lenderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:5000";

  // Fetch all loans for this lender
  const fetchLoans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/lender/${lenderId}/loans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(res.data.loans || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Failed to load loans. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Send ETH via MetaMask
  const sendEthToVendor = async (walletAddress, amountEth) => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not available.");
        return null;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: walletAddress,
        value: parseEther(amountEth.toString()),
      });

      await tx.wait(); // wait for confirmation
      alert(`Transaction successful! Hash: ${tx.hash}`);
      return tx.hash;
    } catch (err) {
      console.error("ETH Transfer Error:", err);
      alert("Transaction failed: " + err.message);
      return null;
    }
  };

  // Handle loan approval
  const handleApprove = async (loan) => {
    const { walletAddress, loanAmount } = loan;

    if (!walletAddress) {
      alert("Vendor wallet address missing.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to approve and send ETH?");
    if (!confirmed) return;

    const txHash = await sendEthToVendor(walletAddress, loanAmount);
    if (!txHash) return;

    try {
      await axios.put(
        `${BASE_URL}/api/lender/loans/${loan._id}/approve`,
        { txHash },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Loan approved successfully.");
      setSelectedLoan(null);
      fetchLoans();
    } catch (err) {
      console.error("Approval Error:", err.message);
      alert("Failed to approve loan.");
    }
  };

  // Handle loan rejection
  const handleReject = async (loanId) => {
    const confirmReject = window.confirm("Are you sure you want to reject this loan?");
    if (!confirmReject) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/api/lender/loans/${loanId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Loan rejection response:", response.data);  // Log the response correctly
      alert("Loan rejected successfully.");
      setSelectedLoan(null);
      fetchLoans();
    } catch (err) {
      console.error("Rejection error:", err.response ? err.response.data : err.message);
      alert("Failed to reject loan." + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (lenderId && token) {
      fetchLoans();
    }
  }, [lenderId, token]);

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "Approved":
        return `${base} bg-green-100 text-green-700`;
      case "Pending":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "Rejected":
        return `${base} bg-red-100 text-red-600`;
      case "Repaid":
        return `${base} bg-blue-100 text-blue-700`;
      default:
        return `${base} bg-gray-200 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Funded Loans</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : loans.length === 0 ? (
        <p className="text-center text-gray-500">No loans found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {loans.map((loan) => (
            <div
              key={loan._id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition border"
            >
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Name:</strong> {loan.fullName} {loan.surname}</p>
                <p><strong>Loan Amount:</strong> {loan.loanAmount} ETH</p>
                <p><strong>Business:</strong> {loan.businessType}</p>
                <p><strong>Status:</strong> <span className={statusBadge(loan.status)}>{loan.status}</span></p>
              </div>

              <div className="flex space-x-3 mt-4">
                <Button label="View Details" onClick={() => setSelectedLoan(loan)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Loan Details */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 max-w-5xl w-full shadow-lg relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Loan Request Details</h2>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Info Section */}
              <div className="flex-1 space-y-3 text-gray-800 text-base leading-relaxed">
                <p><strong>Full Name:</strong> {selectedLoan.fullName} {selectedLoan.surname}</p>
                <p><strong>Email:</strong> {selectedLoan.email}</p>
                <p><strong>Phone:</strong> {selectedLoan.phone}</p>
                <p><strong>Loan Amount:</strong> {selectedLoan.loanAmount} ETH</p>
                <p><strong>Business Type:</strong> {selectedLoan.businessType}</p>
                <p><strong>Reason:</strong> {selectedLoan.reason}</p>
                <p><strong>Repayment Time:</strong> {selectedLoan.repayTime} months</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={statusBadge(selectedLoan.status)}>{selectedLoan.status}</span>
                </p>
                <p><strong>Applied On:</strong> {new Date(selectedLoan.createdAt).toLocaleDateString()}</p>

                {selectedLoan.status === "Pending" && (
                  <div className="flex gap-4 mt-4">
                    <Button label="Approve" onClick={() => handleApprove(selectedLoan)} />
                    <Button
                      label="Reject"
                      onClick={() => handleReject(selectedLoan._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    />
                  </div>
                )}
              </div>

              {/* Image Section */}
              <div className="flex-1 space-y-5">
                {selectedLoan.aadhaarImage && (
                  <div>
                    <p className="text-base font-medium text-gray-700 mb-2">Aadhaar Image:</p>
                    <img
                      src={`${BASE_URL}/uploads/${selectedLoan.aadhaarImage}`}
                      alt="Aadhaar"
                      className="rounded-lg w-full max-h-64 object-contain border"
                    />
                  </div>
                )}
                {selectedLoan.businessImage && (
                  <div>
                    <p className="text-base font-medium text-gray-700 mb-2">Business Image:</p>
                    <img
                      src={`${BASE_URL}/uploads/${selectedLoan.businessImage}`}
                      alt="Business"
                      className="rounded-lg w-full max-h-64 object-contain border"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => setSelectedLoan(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LenderLoans;
