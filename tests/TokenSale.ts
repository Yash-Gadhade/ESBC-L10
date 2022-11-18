import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyERC20, MyERC20__factory, TokenSale, TokenSale__factory } from "../typechain-types";

const TOKEN_ETH_RATIO = 1;

describe("NFT Shop", async () => {
    let accounts: SignerWithAddress[];
    let tokenSaleContract: TokenSale;
    let paymentTokenContract: MyERC20;

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        const erc20TokenFactory = new MyERC20__factory(accounts[0]);
        const tokenSaleContractFactory = new TokenSale__factory(accounts[0]);
        paymentTokenContract = await erc20TokenFactory.deploy();
        await paymentTokenContract.deployed();
        tokenSaleContract = await tokenSaleContractFactory.deploy(
            TOKEN_ETH_RATIO,
            paymentTokenContract.address
        );
        await tokenSaleContract.deployed();
        const MINTER_ROLE = await paymentTokenContract.MINTER_ROLE();
        const giveRoleTx = await paymentTokenContract.grantRole(MINTER_ROLE, tokenSaleContract.address);
        await giveRoleTx.wait();
    });

    describe("When the Shop contract is deployed", async () => {
        it("defines the ratio as provided in parameters", async () => {
            const ratio = await tokenSaleContract.ratio();
            expect(ratio).to.eq(TOKEN_ETH_RATIO);
        });

        it("uses a valid ERC20 as payment token", async () => {
            const erc20TokenAddress = await tokenSaleContract.paymentToken();
            const erc20TokenFactory = new MyERC20__factory(accounts[0]);
            const erc20TokenContract = erc20TokenFactory.attach(erc20TokenAddress);
            await expect(erc20TokenContract.totalSupply()).not.to.be.reverted;
            await expect(erc20TokenContract.balanceOf(accounts[0].address)).not.to.be.reverted;
        });
    });

    describe("When a user purchase an ERC20 from the Token contract", async () => {
        const ETH_SENT = ethers.utils.parseEther("1");

        beforeEach(async () => {
            const tx = await tokenSaleContract.connect(accounts[1]).purchaseTokens({
                value: ETH_SENT,
            });
            await tx.wait();
        });

        it("charges the correct amount of ETH", async () => {
            throw new Error("Not implemented");
        });

        it("gives the correct amount of tokens", async () => {
            const balanceBN = await paymentTokenContract.balanceOf(accounts[1].address);
            expect(balanceBN).to.eq(ETH_SENT.div(TOKEN_ETH_RATIO))
        });
    });

    describe("When a user burns an ERC20 at the Shop contract", async () => {
        it("gives the correct amount of ETH", async () => {
            throw new Error("Not implemented");
        });

        it("burns the correct amount of tokens", async () => {
            throw new Error("Not implemented");
        });
    });

    describe("When a user purchase a NFT from the Shop contract", async () => {
        it("charges the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        });

        it("gives the correct nft", async () => {
            throw new Error("Not implemented");
        });

        it("updates the owner pool account correctly", async () => {
            throw new Error("Not implemented");
        });

        it("update the public pool account correctly", async () => {
            throw new Error("Not implemented");
        });

        it("favors the public pool with the rounding", async () => {
            throw new Error("Not implemented");
        });
    });

    describe("When a user burns their NFT at the Shop contract", async () => {
        it("gives the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        });
        it("updates the public pool correctly", async () => {
            throw new Error("Not implemented");
        });
    });

    describe("When the owner withdraw from the Shop contract", async () => {
        it("recovers the right amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        });

        it("updates the owner pool account correctly", async () => {
            throw new Error("Not implemented");
        });
    });
});