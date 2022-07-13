// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { Signer } = require("ethers");
const hre = require("hardhat");

async function main() {

  // get signer
  const [owner] = await ethers.getSigners();

  // We get the deployed MoonSafe contract
  const moonSafe = await hre.ethers.getContractAt("MoonSafe", "0x2dd2812b07B59Cb89E8077c6CB42c6D6ee08ca12");
  const routerAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  const uRouter = await hre.ethers.getContractAt("IUniswapV2Router02", routerAddress);
  const router = uRouter.connect(owner)

  // approve router to use max amount of tokens from owner's wallet
  const max = (2^256 - 1);
  await moonSafe.connect(owner).approve(router.address, max);

  // define amounts to add to LP
  const tokenBalance = await moonSafe.balanceOf(owner.address);
  console.log(tokenBalance)
  const tokensToAdd = tokenBalance;
  const ethToAdd = 100;

  await router.connect(owner).addLiquidityETH(
    moonSafe.address,
    tokensToAdd,
    0, // slippage is unavoidable
    ethToAdd, // slippage is unavoidable
    owner.address,
    (Date.now() + 100000)
  );

  const pairAddress = await moonSafe.uniswapV2Pair();
  const pair = await hre.ethers.getContractAt("IUniswapV2Pair", pairAddress);
  const lpBalance = await pair.balanceOf(owner.address)
  console.log(lpBalance);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
