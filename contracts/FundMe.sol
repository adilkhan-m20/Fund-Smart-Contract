//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error FundMe_NotOwner();

contract FundMe {
    mapping(address => uint256) public addressToAmountFunded;
    address public immutable owner;
    address[] public funders;

    constructor() public {
        owner = msg.sender;
    }

    function fund() public payable {
        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }

    modifier onlyOwner() {
        //require(msg.sender==owner,"Sender is not Owner");
        if (msg.sender != owner) {
            revert FundMe_NotOwner();
        }
        _;
    }

    function withdraw() public payable onlyOwner {
        /*
        address payable recipient=payable(msg.sender);
        recipient.transfer(address(this).balance);
        */
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        //transfer
        //payable(msg.sender).transfer(address(this).balance);
        //send
        //bool sendSuccess=payable(msg.sender).send(address(this).balance);
        //require(sendSuccess,"Send Failed");
        //call
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender)
            .call{value: address(this).balance}("");
        require(callSuccess, "call Failed");
    }

    function WithdrawA(uint256 amount) public payable onlyOwner {
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender)
            .call{value: amount}("");
        require(callSuccess, "call Failed");
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
