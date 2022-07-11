// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [owner] = await ethers.getSigners();


  // Get the contracts to interact with
  const moonSafe = await hre.ethers.getContractAt("MoonSafe", "0x2dd2812b07B59Cb89E8077c6CB42c6D6ee08ca12");
  
  const pairAddress = await moonSafe.connect(owner).uniswapV2Pair();
  console.log(pairAddress);

  //const pair = await hre.ethers.getContractAt("IUniswapV2Pair", pairAddress);


  //const lpAmount = await 
  
  //console.log("LP balance of owner:", lpAmount);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
