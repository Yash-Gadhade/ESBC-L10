// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMyERC20Token {
    function mint(address to, uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;
}

contract TokenSale {
    uint256 public ratio;
    IMyERC20Token public paymentToken;

    constructor(uint256 _ratio, address _paymentToken) {
        ratio = _ratio;
        paymentToken = IMyERC20Token(_paymentToken);
    }

    function purchaseTokens() external payable {
        paymentToken.mint(msg.sender, msg.value / ratio);
    }

    function burnTokens(uint256 amount) external {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount*ratio);
    }
}
