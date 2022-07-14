const hre = require("hardhat");

async function main() {

  // get signer
  const [ owner, user1, user2 ] = await ethers.getSigners();

  // We get the deployed MoonSafe contract
  const MoonSafe = await hre.ethers.getContractFactory("MoonSafe");
  const moonSafe = await MoonSafe.deploy();

  await moonSafe.deployed();
  
  console.log("MoonSafe deployed to:", moonSafe.address);

  // get uniswap router
  const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const uRouter = await hre.ethers.getContractAt('IUniswapV2Router02', routerAddress);
  const router = uRouter.connect(owner)

  // define amounts to add to LP
  const tokenBalanceBefore = await moonSafe.balanceOf(owner.address);
  console.log(`tokenbalance before: ${tokenBalanceBefore}`)
  const tokensToAdd = tokenBalanceBefore.div(2);
  const baseCurToAdd = ethers.utils.parseEther("5.0")

  // approve router address to spent tokens from owner's wallet
  await moonSafe.connect(owner).approve(routerAddress, tokensToAdd);

  // approve router address to spent LP tokens from owner's wallet
  const pairAddress = await moonSafe.uniswapV2Pair();
  const pair = await hre.ethers.getContractAt('IUniswapV2Pair', pairAddress);
  await pair.connect(owner).approve(routerAddress, '1000000000000000000000000');

  // approve router address to spent WETH from owner's wallet
  const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  const weth = await hre.ethers.getContractAt("IERC20", wethAddress);
  await weth.connect(owner).approve(routerAddress, baseCurToAdd);

  // add 1000 wei of token and WETH to pair
  //await moonSafe.connect(owner).transfer(pairAddress, '100000000000000');

  // add liquidity
  const lpAddTx = await router.connect(owner).addLiquidityETH(
    moonSafe.address,
    tokensToAdd,
    0, // slippage is unavoidable
    baseCurToAdd,
    owner.address,
    (Date.now() + 100000),
    {value : baseCurToAdd}
  );

  // log tokenbalances
  const tokenBalanceAfter = await moonSafe.balanceOf(owner.address);
  console.log(`tokenbalance owner after: ${tokenBalanceAfter}`);

  // check if owner has received LP tokens in exchange for tokens
  const lpBalance = await pair.balanceOf(owner.address);
  console.log(`lp balance of owner: ${lpBalance}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
