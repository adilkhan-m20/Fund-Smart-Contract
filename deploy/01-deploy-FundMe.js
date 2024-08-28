/*async function deployFunc(hre){
    console.log("Hi");
}
module.exports.default=deployFunc*/
//const helperConfig=require("../helper-hardhat-config");
//const networkConfig=helperConfig.networkConfig;
const {netwrokConfig} = require("../helper-hardhat-config");
const {network} = require ("hardhat");
const {verify} = require ("../utils/verify");
const {developmentChains} = require ("../helper-hardhat-config");
require("dotenv").config();

module.exports = async (hre) =>{
    const{ getNamedAccounts, deployments} = hre;
    //hre.getNamedAccounts
    //hre.deployments
    const{ deploy, log }= deployments;
    const{ deployer } = await getNamedAccounts();
    const chainId=network.config.chainId;

    //const ethUsdPriceFeedAddress=networkConfig[chainId]["ethUsdPriceFeed"];
    let ethUsdPriceFeedAddress;
    if(developmentChains.includes(network.name/*chainId==31337*/)){
        const ethUsdAggregator=await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress= ethUsdAggregator.address;
    }
    else{
        ethUsdPriceFeedAddress=netwrokConfig[chainId]["ethUsdPriceFeed"];
    }
    log("--------------------------------------------------");
    log("Deploying FundMe and waiting for Confirmations.....");

    //when going for local host or hardhat network we want to use  a mock
    const argss=[];
    log(ethUsdPriceFeedAddress);
    const fundMe=await deploy("FundMe", {
        from : deployer,
        args : argss,
        log : true,
        waitConfirmations: network.config.blockConfirmations||1
    });
    log("FundMe Deployed at "+fundMe.address);

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address, argss);
    }

    log("------------------------------------------");
}

module.exports.tags=["all","fundme"];