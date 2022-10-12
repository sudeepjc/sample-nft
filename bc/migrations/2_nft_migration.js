const STUNFT = artifacts.require("STUNFT");

module.exports = async function (deployer) {
  await deployer.deploy(STUNFT,"https://gateway.pinata.cloud/ipfs/QmdcmVb5NM8THsGNF5uYRA91SJfLedNtg9jGYui3C2nLBE");

  // const nftContract = await STUNFT.deployed();

  // await nftContract.mint({value: web3.utils.toWei("0.0001","ether")});
  //0x4088Eb03e0f2e4F1bC3CD4720F55769436AB6403

};
