// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract funder {
    uint256 public numoffunder;

    mapping(uint256 => address) private funders;

    function recive() external{}

    function trasfer() external payable {
        funders[numoffunder] = msg.sender;
    }

    function withdraw(uint256 amount) external {
        require(amount <= 2000000000000000000,"limit is 2 ether");
        payable(msg.sender).transfer(amount); 
    }
}
