// simplified-microloans/test/testLoanContract.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoanContract", function () {
  let loanContract;
  let owner, vendor1, vendor2;

  beforeEach(async () => {
    [owner, vendor1, vendor2] = await ethers.getSigners();

    const LoanContract = await ethers.getContractFactory("LoanContract");
    loanContract = await LoanContract.deploy();
    await loanContract.deployed();
  });

  it("Should register a vendor", async () => {
    await loanContract.registerVendor(vendor1.address);
    const vendor = await loanContract.vendors(vendor1.address);
    expect(vendor.walletAddress).to.equal(vendor1.address);
    expect(vendor.exists).to.equal(true);
  });

  it("Should record sales for a registered vendor", async () => {
    await loanContract.registerVendor(vendor1.address);
    await loanContract.recordSales(vendor1.address, 500);
    const sales = await loanContract.getSales(vendor1.address);
    expect(sales).to.equal(500);
  });

  it("Should approve a loan", async () => {
    await loanContract.registerVendor(vendor1.address);
    await loanContract.approveLoan(vendor1.address, 1000, 5, 7);
    const loan = await loanContract.getLoanStatus(vendor1.address);
    expect(loan.amount).to.equal(1000);
    expect(loan.interestRate).to.equal(5);
    expect(loan.isRepaid).to.equal(false);
  });

  it("Should allow vendor to repay loan", async () => {
    await loanContract.registerVendor(vendor1.address);
    await loanContract.approveLoan(vendor1.address, 1000, 10, 7);

    const totalDue = 1000 + (1000 * 10) / 100;

    // Connect as vendor1 and repay loan
    await loanContract.connect(vendor1).repayLoan({ value: ethers.utils.parseEther(totalDue.toString()) });

    const loan = await loanContract.getLoanStatus(vendor1.address);
    expect(loan.isRepaid).to.equal(true);
  });

  it("Should not allow non-vendor to repay loan", async () => {
    await expect(
      loanContract.connect(vendor2).repayLoan({ value: ethers.utils.parseEther("1000") })
    ).to.be.revertedWith("Not a registered vendor");
  });
});
