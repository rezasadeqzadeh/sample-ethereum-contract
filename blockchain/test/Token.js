const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Token contract", function () {
  it("Call updateWitheList and WhiteListUpdated should emitted", async function () {
    const Token = await ethers.getContractFactory("Token");
    const deployedContract = await Token.deploy();    
    const hashRoot  =  "0xb72a532ad96911d76a1d47b4c12adc83b584a0ba9006cf1a0cc35af1182c028e";
    await expect(deployedContract.updateWitheList(hashRoot)).
    to.emit(deployedContract, "WhiteListUpdated").withArgs(hashRoot)
  });

});