const chai = require('chai');
const { expect } = require('chai');
const BN = require('bn.js');
const { ethers } = require('hardhat');

// Enable and inject BN dependency
chai.use(require('chai-bn')(BN));

describe('TestToken Unit Test', function() {
    before(async function () {
        TestToken = await ethers.getContractFactory('TestToken')
        testToken = await TestToken.deploy()
        await testToken.deployed()
    })

    beforeEach(async function() {
        await testToken.setFees(0, 0);
    })

    it('Testing sets development fee to zero', async function () {
        expect((await testToken.developmentFee()).toString()).to.equal('0');
    });
    
    
    it('DevelopmentFee returns a value previously set', async function () {
        const developmentFeeNumber = 5;
        const marketingFeeNumber = 3;
        await testToken.setFees(developmentFeeNumber, marketingFeeNumber);
        expect((await testToken.developmentFee()).toString()).to.equal(developmentFeeNumber.toString());
        expect((await testToken.marketingFee()).toString()).to.equal(marketingFeeNumber.toString());
    });
    
    it('Contract receives correct token amount of tokens through fees', async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const marketingFeeNumber = 3;
        const developmentFeeNumber = 5;
        const marketingFeeReceiver = 0x3E188aa9e4511BE67Cb46eCE53e9e6f2Be35C1bf;
        const tokenAmountSend = 1_000_000

        await testToken.setFees(developmentFeeNumber, marketingFeeNumber);
        await testToken.transfer(addr1.address, tokenAmountSend);
        await testToken.connect(addr1).transfer(addr2.address, tokenAmountSend);

        expect(await testToken.balanceOf(testToken.address)).to.equal((
            tokenAmountSend * (marketingFeeNumber + developmentFeeNumber) / 100).toString()
        );
    })

   
})
