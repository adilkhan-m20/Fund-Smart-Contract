const {deployments, ethers, getNamedAccounts }= require("hardhat");
const {assert}=("chai");
describe("FundMe",async function(){
    let deployer;
    let fundMe;
    const sendValue=ethers.utils.parseEther("1");
    beforeEach(async function(){
        //deploy our hardhat conntract
        //using hardhat-deploy
        //const accounts=await ethers.getSigners();gets everything from the account section of the network
        //const accountZero=accounts[0];
        deployer=(await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);//fixtures all is use to run all the deploy scripts
        fundMe=await ethers.getContract("FundMe", deployer);
    })

    describe("fund", async function(){
     
        it("update the amount funded data structure", async function(){
            await fundMe.fund({ value:sendValue});
            const response=await fundMe.addressToAmountFunded(deployer);
            assert.equal(response.toString(),sendValue)
        })
        it("add funders to the array of funders",  async function(){
            await fundMe.fund({value:sendValue});
            const funder=await fundMe.funders(0);
            assert.equal(funder,deployer);
        })
    })
    describe("withdraw", async function(){
        beforeEach(async function(){
            await fundMe.fund({value: sendValue});
        })
        it("withdraw ETH from a single funder", async function(){
            //Arrange
            const startingFundMeBalance=await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance=await fundMe.provider.getBalance(deployer);
            //Act
            const transactionResponse=await fundMe.withdraw();
            const transactionReceipt=await transactionResponse.wait(1);
            const{gasUsed,effectiveGasPrice}=transactionReceipt;
            const gasCost=gasUsed.mul(effectiveGasPrice);
            const endingFundMeBalance=await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance=await fundMe.provider.getBalance(deployer);
            //Assert
            assert.equal(endingFundMeBalance,0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance),endingDeployerBalance.add(gasCost).toString());
        })
        it("allows us to withdraw with multiple funders ",async function(){
            //Arrange
            const accounts=await ethers.getSigners();
            for(let x=1;x<6;x++){
                const fundMeConnectedContract=await fundMe.connect(accounts[x]);
                await fundMeConnectedContract.fund({value:sendValue});
            }
            const startingFundMeBalance=await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance=await fundMe.provider.getBalance(deployer);
            //Act
            const transactionResponse=await fundMe.withdraw();
            const transactionReceipt=await transactionResponse.wait(1);
            const{gasUsed,effectiveGasPrice}=transactionReceipt;
            const gasCost=gasUsed.mul(effectiveGasPrice);
            //Assert
            assert.equal(endingFundMeBalance,0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString());
            //make sure that the funders are reset properly
            await expect(fundMe.funders(0)).to.be.reverted;
            for(let x=1;x<6;x++){
                assert.equal(await fundMe.addressToAmountFunded(accounts[x].address,0));
            }
        })
        it("allows us to withdraw a specific amount from the funders", async function(){
            //Arrange
            withdrawAmount=ethers.utils.parseEther("0.5");
            const startingFundMeBalance=await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance=await fundMe.provider.getBalance(deployer);
            //Act
            const transactionResponse=await fundMe.WithdrawA(ethers.utils.parseEther(withdrawAmount));
            const transactionReceipt=await transactionResponse.wait(1);
            const {gasUsed,effectiveGasPrice}=transactionReceipt;
            const gasCost=gasUsed.mul(effectiveGasPrice);
            const endingFundMeBalance=await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance=await fundMe.provider.getBalance(deployer);
            //Assert
            assert.equal(startingDeployerBalance+withdrawAmount,endingDeployerBalance.add(gasCost).toString());
            assert.equal(startingFundMeBalance,endingFundMeBalance+withdrawAmount);
        })
        it("Only allows the owner to withdraw", async function(){
            const accounts=await ethers.getSigners();
            const attacker=accounts[1];
            const attackerConnectedContract=await fundMe.connect(attacker);
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe_NotOwner");

        })
    })
})
