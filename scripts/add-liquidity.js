const hre = require("hardhat");

async function main() {

  // get signer
  const [owner] = await ethers.getSigners();

  // We get the deployed MoonSafe contract
  const moonSafe = await hre.ethers.getContractAt("MoonSafe", '0x2dd2812b07B59Cb89E8077c6CB42c6D6ee08ca12');
  const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const uRouter = await hre.ethers.getContractAt('IUniswapV2Router02', routerAddress);
  const router = uRouter.connect(owner)

  // approve router to use max amount of tokens from owner's wallet
  const max = (2^256 - 1);
  await moonSafe.connect(owner).approve(routerAddress, max);

  // approve router to use max amount of WETH from owner's wallet
  const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  const weth = await hre.ethers.getContractAt("IERC20", wethAddress);
  await weth.connect(owner).approve(routerAddress, max);

  await moonSafe.connect(owner).approve(routerAddress, max);

  // define amounts to add to LP
  const tokenBalanceBefore = await moonSafe.balanceOf(owner.address);
  console.log(`tokenbalance before: ${tokenBalanceBefore}`)
  const tokensToAdd = tokenBalanceBefore.div(2);
  const ethToAdd = 1;

  // add liquidity
  const lpAddTx = await router.populateTransaction.addLiquidityETH(
    moonSafe.address,
    tokensToAdd,
    0, // slippage is unavoidable
    0, // slippage is unavoidable
    owner.address,
    (Date.now() + 100000),
    { value: ethers.utils.parseUnits("1", "ether") }
  );

  await owner.call(lpAddTx);

  // check if owner has succesfully send out tokens 
  const tokenBalanceAfter = await moonSafe.balanceOf(owner.address);
  console.log(`tokenbalance after: ${tokenBalanceAfter}`);

  // check if owner has received LP tokens in exchange for tokens
  const pairAddress = await moonSafe.uniswapV2Pair();
  const pair = await hre.ethers.getContractAt('IUniswapV2Pair', pairAddress);
  const lpBalance = await pair.balanceOf(owner.address)
  console.log(`lp balance after: ${lpBalance}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
