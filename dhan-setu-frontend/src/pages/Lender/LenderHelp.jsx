// src/pages/lender/LenderHelp.jsx
import React from "react";

const LenderHelp = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Lender Help Center</h1>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">💸 Funding a Loan</h2>
            <p className="text-gray-600">
              Go to the "Loans" section and review the available vendor requests. Click on <strong>Fund</strong> for any request 
              you wish to support. Confirm the transaction in your connected wallet to transfer ETH.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">🔐 Smart Contract Safety</h2>
            <p className="text-gray-600">
              All loan and repayment processes are handled through Ethereum smart contracts, ensuring transparency 
              and protection for your funds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">📊 Tracking Funded Loans</h2>
            <p className="text-gray-600">
              You can track the status of your funded loans in the Dashboard and Loans section.
              You'll also see repayment status, vendor details, and expected return dates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">💼 ETH Wallet & Repayments</h2>
            <p className="text-gray-600">
              Your wallet balance reflects repayments made by vendors. All repayments are processed 
              automatically and credited to your wallet via smart contracts.
            </p>
          </section>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Still need assistance? Reach out to us at{" "}
              <a href="mailto:support@dhansetu.io" className="text-blue-600 underline">
                support@dhansetu.io
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LenderHelp;
