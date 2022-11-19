// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMyERC20Token {
    function mint(address to, uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external;
}

interface IMyERC721Token {
    function safeMint(address to, uint256 tokenId) external;

    function burn(uint256 tokenId) external;
}

contract TokenSale {
    uint256 public ratio;
    uint256 public price;
    IMyERC20Token public paymentToken;
    IMyERC721Token public nftContract;
    uint256 public ownerPool;
    uint256 public publicPool;

    constructor(
        uint256 _ratio,
        uint256 _price,
        address _paymentToken,
        address _nftContract
    ) {
        ratio = _ratio;
        price = _price;
        paymentToken = IMyERC20Token(_paymentToken);
        nftContract = IMyERC721Token(_nftContract);
    }

    function purchaseTokens() external payable {
        paymentToken.mint(msg.sender, msg.value / ratio);
    }

    function burnTokens(uint256 amount) external {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount * ratio);
    }

    function purchaseNFT(uint256 tokenId) external {
        paymentToken.transferFrom(msg.sender, address(this), price);
        nftContract.safeMint(msg.sender, tokenId);
        publicPool += price / 2;
        ownerPool += price - ownerPool;
    }

    //function burnNft

    //function ownerWithdraw
}
