// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanContract {
    struct Vendor {
        address walletAddress;
        uint256 totalSales;
        bool exists;
    }

    struct Loan {
        uint256 amount;
        uint256 interestRate; // in percent, e.g., 5 for 5%
        uint256 dueDate;
        bool isRepaid;
    }

    address public admin;
    mapping(address => Vendor) public vendors;
    mapping(address => Loan) public loans;

    event VendorRegistered(address indexed vendor);
    event SalesRecorded(address indexed vendor, uint256 amount);
    event LoanApproved(address indexed vendor, uint256 amount);
    event LoanRepaid(address indexed vendor, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyVendor() {
        require(vendors[msg.sender].exists, "Not a registered vendor");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Register a vendor
    function registerVendor(address _vendorAddress) external onlyAdmin {
        require(!vendors[_vendorAddress].exists, "Vendor already exists");
        vendors[_vendorAddress] = Vendor(_vendorAddress, 0, true);
        emit VendorRegistered(_vendorAddress);
    }

    // Record sales data (from Oracle or manually by admin)
    function recordSales(address _vendorAddress, uint256 _amount) external onlyAdmin {
        require(vendors[_vendorAddress].exists, "Vendor not found");
        vendors[_vendorAddress].totalSales += _amount;
        emit SalesRecorded(_vendorAddress, _amount);
    }

    // Apply and approve loan based on average sales
    function approveLoan(address _vendorAddress, uint256 _amount, uint256 _interestRate, uint256 _dueDays) external onlyAdmin {
        require(vendors[_vendorAddress].exists, "Vendor not found");
        require(loans[_vendorAddress].amount == 0 || loans[_vendorAddress].isRepaid, "Existing loan not repaid");

        loans[_vendorAddress] = Loan({
            amount: _amount,
            interestRate: _interestRate,
            dueDate: block.timestamp + (_dueDays * 1 days),
            isRepaid: false
        });

        emit LoanApproved(_vendorAddress, _amount);
    }

    // Vendor repays loan
    function repayLoan() external payable onlyVendor {
        Loan storage loan = loans[msg.sender];
        require(!loan.isRepaid, "Loan already repaid");
        require(loan.amount > 0, "No active loan");

        uint256 totalDue = loan.amount + (loan.amount * loan.interestRate / 100);
        require(msg.value >= totalDue, "Insufficient amount to repay loan");

        loan.isRepaid = true;
        emit LoanRepaid(msg.sender, msg.value);
    }

    // Get vendor sales
    function getSales(address _vendorAddress) public view returns (uint256) {
        return vendors[_vendorAddress].totalSales;
    }

    // Get loan status
    function getLoanStatus(address _vendorAddress) public view returns (uint256 amount, uint256 interestRate, uint256 dueDate, bool isRepaid) {
        Loan memory loan = loans[_vendorAddress];
        return (loan.amount, loan.interestRate, loan.dueDate, loan.isRepaid);
    }

    // Admin can withdraw repaid Ether
    function withdrawFunds() external onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }
}
