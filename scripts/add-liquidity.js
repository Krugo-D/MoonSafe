// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { Signer } = require("ethers");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [owner] = await ethers.getSigners();

  // We get the contract to deploy
  // const MoonSafe = await hre.ethers.getContractFactory("MoonSafe");
  // const moonSafe = await MoonSafe.deploy();
  // await moonSafe.deployed();

  // We get the deployed MoonSafe contract
  const moonSafe = await hre.ethers.getContractAt("MoonSafe", "0x2dd2812b07B59Cb89E8077c6CB42c6D6ee08ca12");

  //const pairAddress = await moonSafe.uniswapV2Pair();
  //const pair = await hre.ethers.getContractAt("IUniswapV2Pair", pairAddress);
  
  const routerAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

  const uRouter = await hre.ethers.getContractAt("IUniswapV2Router02", routerAddress);

  const router = uRouter.connect(owner)

  const max = (2^256 - 1);
  const approve = await moonSafe.connect(owner).approve(router.address, max);


  const tokensToAdd = 1_000_000_000;
  const BnbToAdd = 1

  //  const addLiquidity = await router.connect(owner).addLiquidityETH(
  //    moonSafe.address,
  //    tokensToAdd,
  //    0, 
  //    BnbToAdd,
  //    owner.address,
  //    (Date.now() + 100000)
  //  );

  const addLiquidityTx = await router.populateTransaction.addLiquidityETH(
    moonSafe.address,
    tokensToAdd,
    0, // slippage is unavoidable
    BnbToAdd, // slippage is unavoidable
    owner.address,
    (Date.now() + 100000)
  );

  const tx = await owner.call(addLiquidityTx);
  //const contractLpBalance = await pair.balanceOf(moonSafe.address);


  console.log(tx);
  //console.log(contractLpBalance);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
