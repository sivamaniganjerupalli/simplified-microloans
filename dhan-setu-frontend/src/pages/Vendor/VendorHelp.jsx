// src/pages/vendor/VendorHelp.jsx
import React from "react";


const VendorHelp = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Vendor Help Center</h1>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">📤 Requesting a Loan</h2>
            <p className="text-gray-600">
              Navigate to the "Loans" section and click on <strong>Request Loan</strong>. Fill in your loan amount and reason,
              then submit. You will be notified once it's approved by a lender.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">💼 Smart Contract Basics</h2>
            <p className="text-gray-600">
              DhanSetu uses Ethereum smart contracts to automate loan agreements and repayments.
              Everything is secure, transparent, and recorded on the blockchain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">💰 Receiving and Using ETH</h2>
            <p className="text-gray-600">
              Once your loan is approved, ETH is directly transferred to your linked wallet.
              You can use it for business or personal needs as specified in your loan request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">📈 Tracking Repayments</h2>
            <p className="text-gray-600">
              In your Dashboard, view the repayment schedule, past repayments, and remaining balance.
              The repayment process is also automated via smart contracts for convenience.
            </p>
          </section>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Still have questions? Contact us at{" "}
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

export default VendorHelp;
