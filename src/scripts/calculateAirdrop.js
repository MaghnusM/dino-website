const { ethers } = require("ethers");
const Web3 = require("web3");

// const axios = require('axios').default;
// var fs = require('fs');

const scams = ["0x7be8076f4ea4a4ad08075c2508e481d6c946d12b"];
const SCAM_MULTIPLER = 0.7;

const calculateAirdrop = async (address) => {

    // const provider = new ethers.providers.InfuraProvider("mainnet", "55547757cebe41c286c53dcc2a78f921");
    
    const provider = new ethers.providers.EtherscanProvider("mainnet", "Z2IJ21WHN122F4WD4AURBPIXMF1GJZP8YU");
    let history = await provider.getHistory(address);
    console.log(history);

    var total = 0;
    
    for (var key of Object.keys(history)) {
        const tx = history[key];
        if (tx['from'] == address) {

            // TRANSACTION SENT TO SCAM
            if (scams.includes(tx['to'])) {
                console.log("SCAM!!");
                total = token + 1000;

                const amount = Web3.utils.fromWei(tx['value']);
                console.log(amount);
            }
        } else if (tx['to'] == address) {

            // TRANSATION FROM SCAM
            if (scams.includes(tx['to'])) {
                console.log("FROM SCAM!!");
            }

        } else {
            console.log("ERROR");
        }
    }
}

const runCalculateAirdrop = async (address) => {
    try {
        return await calculateAirdrop(address);
    } catch (error) {
        console.log(error);
        return {};
    }
};
    
// runCalculateAirdrop();