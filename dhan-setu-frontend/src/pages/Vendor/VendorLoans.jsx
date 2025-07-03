import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

const VendorLoans = () => {
  const navigate = useNavigate();
  const [selectedLoan, setSelectedLoan] = useState(null);

  const [loans, setLoans] = useState([
    {
      id: 1,
      lender: "Sai Kumar",
      amount: "0.15 ETH",
      status: "Approved",
      date: "2025-06-20",
      purpose: "For expanding vegetable cart",
      repaymentDue: "2025-07-20",
    },
    {
      id: 2,
      lender: "Deepak Verma",
      amount: "0.25 ETH",
      status: "Pending",
      date: "2025-06-25",
      purpose: "Medical Emergency",
      repaymentDue: "2025-08-01",
    },
    {
      id: 3,
      lender: "Anjali Reddy",
      amount: "0.20 ETH",
      status: "Rejected",
      date: "2025-06-10",
      purpose: "Buying seasonal fruit stock",
      repaymentDue: "N/A",
    },
  ]);

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-yellow-700 bg-yellow-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Loan Requests</h1>
            <Button
              label="Request New Loan"
              onClick={() => navigate("/vendor/request-loan")} // Navigate to form
            />
          </div>

          {loans.length === 0 ? (
            <p className="text-gray-600">No loan requests yet. Click the button above to request one.</p>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="bg-white shadow-md p-5 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700"><strong>Lender:</strong> {loan.lender}</p>
                      <p className="text-gray-700"><strong>Amount:</strong> {loan.amount}</p>
                      <p className="text-gray-700"><strong>Date:</strong> {loan.date}</p>
                      <p
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                          loan.status
                        )}`}
                      >
                        {loan.status}
                      </p>
                    </div>
                    <div>
                      <Button
                        label="View Details"
                        onClick={() => setSelectedLoan(loan)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Loan Details Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
            <p><strong>Lender:</strong> {selectedLoan.lender}</p>
            <p><strong>Amount:</strong> {selectedLoan.amount}</p>
            <p><strong>Date:</strong> {selectedLoan.date}</p>
            <p><strong>Status:</strong> {selectedLoan.status}</p>
            <p><strong>Purpose:</strong> {selectedLoan.purpose}</p>
            <p><strong>Repayment Due:</strong> {selectedLoan.repaymentDue}</p>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

export default VendorLoans;
