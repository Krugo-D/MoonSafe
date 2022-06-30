const chai = require('chai');
const { expect } = require('chai');
const BN = require('bn.js');
const { ethers } = require('hardhat');

// Enable and inject BN dependency
chai.use(require('chai-bn')(BN));

describe('TestNft Unit Test', function() {
    before(async function () {
        TestNft = await ethers.getContractFactory('TestNft')
        testNft = await TestNft.deploy()
        await testNft.deployed()
    })

    //beforeEach(async function() {
    //    await testNft.mint();
    //})

    it('Owner can mint before launch', async function () {
        const [owner] = await ethers.getSigners();
        await testNft.presaleMint([owner.address]);
        const balance = await testNft.balanceOf(owner.address);
        expect(balance.toString()).to.equal("1");
    });

    it('Users can not use presaleMint function', async function () {
        const [owner, addr1] = await ethers.getSigners();
        const balance = await testNft.balanceOf(addr1.address)
        expect(balance.toString()).to.equal("0");
    });
 
    

})
