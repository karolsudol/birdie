import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TravelSaver", function () {
  async function deployTravelSaver() {
    const [owner, operatorWallet, acc1, acc2, acc3] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TokenERC20");
    const token = await Token.deploy();

    const TravelSaver = await ethers.getContractFactory("TravelSaver");
    const travelSaver = await TravelSaver.deploy(
      token.address,
      operatorWallet.address
    );

    return {
      travelSaver,
      token,
      operatorWallet,
      owner,
      acc1,
      acc2,
      acc3,
    };
  }

  it("Should create TravelPlan, make a payment and withdraw correcty", async function () {
    const { travelSaver, token, operatorWallet, owner, acc1, acc2 } =
      await loadFixture(deployTravelSaver);

    // check balances at the start

    await expect(
      token.connect(acc1).mint(acc1.address, 100)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await token.connect(owner).mint(acc1.address, 100);
    expect(await token.balanceOf(acc1.address)).to.equal(100);
    expect(await token.balanceOf(travelSaver.address)).to.equal(0);
    expect(await token.balanceOf(owner.address)).to.equal(0);

    // create plan and make a contribution

    const operatorPlanID = 101;
    const operatorUserID = 1;

    await expect(
      travelSaver.connect(acc1).createTravelPlan(operatorPlanID, operatorUserID)
    )
      .to.emit(travelSaver, "CreatedTravelPlan")
      .withArgs(1, acc1.address, travelSaver.travelPlans);

    const plan = await travelSaver.getTravelPlanDetails(1);
    expect(plan.contributedAmount).equal(0);
    expect(plan.owner).equal(acc1.address);
    expect(plan.operatorPlanID).equal(operatorPlanID);
    expect(plan.operatorUserID).equal(operatorUserID);

    await expect(
      travelSaver.connect(acc1).contributeToTravelPlan(1, 10)
    ).to.be.revertedWith("ERC20: insufficient allowance");

    await token.connect(acc1).approve(travelSaver.address, 10);

    await expect(
      travelSaver.connect(acc1).contributeToTravelPlan(33, 10)
    ).to.be.revertedWith("doesn't exist");

    await expect(travelSaver.connect(acc1).contributeToTravelPlan(1, 10))
      .to.emit(travelSaver, "Transfer")
      .withArgs(acc1.address, travelSaver.address, 10)
      .to.emit(travelSaver, "ContributeToTravelPlan")
      .withArgs(1, acc1.address, 10);

    expect((await travelSaver.getTravelPlanDetails(1)).contributedAmount).equal(
      10
    );

    expect(await token.balanceOf(acc1.address)).to.equal(90);
    expect(await token.balanceOf(travelSaver.address)).to.equal(10);

    // claim

    await expect(
      travelSaver.connect(acc1).claimTravelPlan(33, 10)
    ).to.be.revertedWith("doesn't exist");

    await expect(
      travelSaver.connect(acc2).claimTravelPlan(1, 5)
    ).to.be.revertedWith("not owner");

    await expect(
      travelSaver.connect(acc1).claimTravelPlan(1, 15)
    ).to.be.revertedWith("insufficient funds");

    await expect(travelSaver.connect(acc1).claimTravelPlan(1, 5))
      .to.emit(travelSaver, "Transfer")
      .withArgs(travelSaver.address, operatorWallet.address, 5)
      .to.emit(travelSaver, "ClaimTravelPlan")
      .withArgs(1, acc1.address, 5);

    expect(await token.balanceOf(travelSaver.address)).to.equal(5);
    expect(await token.balanceOf(operatorWallet.address)).to.equal(5);

    expect((await travelSaver.getTravelPlanDetails(1)).contributedAmount).equal(
      5
    );
  });

  it("Should create PaymentPlan and make payments correcty", async function () {
    const { travelSaver, token, operatorWallet, owner, acc1, acc2, acc3 } =
      await loadFixture(deployTravelSaver);

    await token.connect(owner).mint(acc1.address, 100);

    const operatorPlanID = 101;
    const operatorUserID = 1;
    travelSaver.connect(acc1).createTravelPlan(operatorPlanID, operatorUserID);

    await expect(
      travelSaver.connect(acc1).createPaymentPlan(1, 100, 5, 10)
    ).to.be.revertedWith("ERC20: insufficient allowance");

    await token.connect(acc1).approve(travelSaver.address, 100);

    await expect(
      travelSaver.connect(acc1).createPaymentPlan(2, 10, 5, 10)
    ).to.be.revertedWith("doesn't exist");

    await expect(travelSaver.connect(acc1).createPaymentPlan(1, 10, 3, 10))
      .to.emit(travelSaver, "CreatedPaymentPlan")
      .withArgs(1, acc1.address, travelSaver.paymentPlans);

    // await travelSaver.connect(acc1).cancelPaymentPlan(1);

    await expect(travelSaver.connect(acc1).runInterval(1)).to.be.revertedWith(
      "too early"
    );

    await expect(
      travelSaver.connect(acc2).cancelPaymentPlan(1)
    ).to.be.revertedWith("only plan owner");

    await expect(travelSaver.connect(acc1).runInterval(33)).to.be.revertedWith(
      "plan ended"
    );

    const sec60 = (await time.latest()) + 60;
    await time.increaseTo(sec60);

    await travelSaver.connect(acc1).runInterval(1);
    expect(
      (await travelSaver.getPaymentPlanDetails(1)).intervalsProcessed
    ).equal(1);

    await time.increaseTo(sec60 + sec60);
    await travelSaver.connect(acc1).runInterval(1);
    await time.increaseTo(sec60 + sec60 + sec60);
    await travelSaver.connect(acc1).runInterval(1);

    await expect(travelSaver.connect(acc1).runInterval(1)).to.be.revertedWith(
      "plan ended"
    );

    await expect(travelSaver.connect(acc1).createPaymentPlan(1, 10, 3, 10))
      .to.emit(travelSaver, "CreatedPaymentPlan")
      .withArgs(2, acc1.address, travelSaver.paymentPlans);

    await travelSaver.connect(acc1).cancelPaymentPlan(2);

    await expect(travelSaver.connect(acc1).createPaymentPlan(1, 10, 3, 10))
      .to.emit(travelSaver, "CreatedPaymentPlan")
      .withArgs(3, acc1.address, travelSaver.paymentPlans);

    await expect(travelSaver.connect(acc1).createPaymentPlan(1, 10, 3, 10))
      .to.emit(travelSaver, "CreatedPaymentPlan")
      .withArgs(4, acc1.address, travelSaver.paymentPlans);

    await time.increaseTo(sec60 + sec60 + sec60 + sec60);

    await travelSaver.connect(acc1).runIntervals([3, 4]);
  });

  it("Should create Travel and Payment Plans in one go correcty", async function () {
    const { travelSaver, token, operatorWallet, owner, acc1, acc2, acc3 } =
      await loadFixture(deployTravelSaver);

    await token.connect(owner).mint(acc1.address, 100);
    await token.connect(acc1).approve(travelSaver.address, 100);

    const operatorPlanID = 101;
    const operatorUserID = 1;
    travelSaver
      .connect(acc1)
      .createTravelPaymentPlan(operatorPlanID, operatorUserID, 10, 3, 10);

    // await expect(
    //   travelSaver.connect(acc1).createPaymentPlan(2, 10, 5, 10)
    // ).to.be.revertedWith("doesn't exist");
  });
});
