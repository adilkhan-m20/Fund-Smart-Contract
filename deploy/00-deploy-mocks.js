const{network}=require("hardhat");
const {developmentChains, DECIMALS, INITIAL_ANSWER} = require("../helper-hardhat-config");

//mocking is creating objects that simulate the behaviour of real objects
module.exports=async({getNamedAccounts, deployments}) => {
    const{deploy,log}=deployments;
    const{deployer}=await getNamedAccounts();
    const chainId=network.config.chainId;

    if(/*developmentChains.includes(network.name)*/chainId==31337){
        log("Local network detected! Deploying mocks...");
        await deploy("MockV3Aggregator",{
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args:[DECIMALS, INITIAL_ANSWER] ,
        })
        log("Mocks Deployed!");
        log("--------------------------------------------");
    }
}

module.exports.tags=["all", "mocks"];