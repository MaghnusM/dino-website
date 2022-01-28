import './styles/App.css';
import discordLogo from './assets/discordlogo.svg';
import Menu from './Menu';
import TwitterLogo from './assets/twitter-logo.svg';
import DiscordLogo from './assets/discord.png';
import OpenseaLogo from './assets/opensea.png';

import artbook1 from './assets/artbook1.png';
import artbook2 from './assets/artbook2.png';

import dino1gif from './assets/dinogif1.gif';
import dino1 from './assets/dino1.png';
import dino2 from './assets/dino2.png';
import dino3 from './assets/dino3.png';

import sample1 from './assets/sample1.png';
import sample2 from './assets/sample2.png';
import sample3 from './assets/sample3.png';
import sample4 from './assets/sample4.png';
import sample5 from './assets/sample5.png';
import sample6 from './assets/sample6.png';
import sample7 from './assets/sample7.png';
import sample8 from './assets/sample8.png';
import dinotopiaIsReal from './assets/dinotopia.png';

import dinoverseartbook from './assets/dinoverseartbook.png';
import dinoverseticket from './assets/dinoverseticket.png';
import dinoad from './assets/dinoad.png';

import Swal from "sweetalert2";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import DinosDeluxe from './utils/DinosDeluxe.json';

// Constants
// const TWITTER_HANDLE = '';

const App = () => {

  const CONTRACT_ADDRESS = "0x7e7B066b5752f0eb1768BdeFcF7bCd4a493d387B";

  const [currentAccount, setCurrentAccount] = useState("");
  const [isMintActive, setIsMintActive] = useState("");
  const [numMfers, setNumMfers] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  const [currentBalance, setCurrentBalance] = useState(0);

  const contractABI = DinosDeluxe.abi;

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIsMintActive();
    updateTotalSupply();
    updateBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIsMintActive = async () => {
    console.log("CHECK IS MINT ACTIVE");
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        setIsMintActive(await connectedContract.isSaleActive());
        console.log(await connectedContract.isSaleActive());
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateTotalSupply = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        let supply = parseInt(await connectedContract.totalSupply());
        console.log("supply");
        console.log(`${supply}`);
        setTotalSupply(parseInt(`${supply}`));
      }
    } catch (error) {
      console.log(error);
      console.log("cant find contract?");
    }
  }

  const updateBalance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        setCurrentBalance(parseInt(await connectedContract.balanceOf(currentAccount)));
        console.log("balance");
        console.log(`${currentBalance}`);
      }
    } catch (error) {
      console.log(error);
      console.log("cant find contract?");
    }
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account)
      console.log("have an account");
    } else {
      console.log("no account");
    }

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("no metamask detected");
        setNumMfers(0);
      } else {
        const accounts = await ethereum.request({ method: "eth_requestAccounts"});

        if (accounts.length !== 0) {
          const account = accounts[0];
          setCurrentAccount(account);
          console.log("UPDATE SUPPLY");
          updateTotalSupply();
          checkIfWalletIsConnected();
          window.location.reload(false);
        } else {
          console.log("no accounts!");
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const mint = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        try {
          if (numMfers > 0) {
            console.log("Going to pop wallet now to pay gas...")

            var supply = parseInt(String(await connectedContract.totalSupply()));
            console.log(supply);
            var amount = 0.0;

            if (parseInt(supply) + parseInt(numMfers) > 500) {
              console.log("supply");
              console.log(parseInt(supply));
              amount = numMfers * 0.03;
            }

            console.log("amount");
            console.log(amount);

            var options = {
              value: ethers.utils.parseEther(String(amount)),
            };

            var methodGasEstimate = await connectedContract.estimateGas.mint(numMfers, options);
            // await nftTxn.wait();
            methodGasEstimate = parseInt(methodGasEstimate);
            console.log(`contract method gas estimate ${methodGasEstimate}`);
            console.log(`amount ${amount}`);

            options = {
              value: ethers.utils.parseEther(String(amount)),
              gasLimit: parseInt(methodGasEstimate * 1.2),
            }

            let nftTxn = await connectedContract.mint(numMfers, options);
            console.log("Mining mint... please wait.")
            await nftTxn.wait();
            updateBalance();
            Swal.fire(`Successfully minted ${numMfers} Dinos!`, '', 'info');
            console.log(`Mined, see transaction: https://etherscan.io/tx/${nftTxn.hash}`);
          }
        } catch (error) {
          // alert(`couldn't mint ${numMfers} tokens `);
          var errorMessage = error.message.substring(
            error.message.lastIndexOf("message") + 1, 
            error.message.lastIndexOf("method")
          );
          if (errorMessage !== "") {
            alert(errorMessage);
            console.log(error.message);
          }
        }

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="App">
      <Menu />
        {/* <a href="https://discord.gg/CTJXEXNuZN"></a> */}
          {/* <img src={discordLogo} alt="discordLogo" className="social-icon-discord"/> */}
        {/* <p className="supply"><a href="https://etherscan.io/address/0x68CCdcf9d5CB0e61d72c0b31b654d6408A93C65a">CONTRACT</a></p> */}
      <div id="mint" className="container">
        <iframe id="ytplayer" type="text/html" width="100%" height="500px"
            src="https://www.youtube.com/embed/KVIfhg5aUw4?autoplay=0&mute=0"
            frameborder="0"></iframe>
        <div className="header-container">
          <div className="content-container">
            {/* <img src={ddLogo} alt="ddLogo" className="dd-logo"/> */}
            <p className="header gradient-text title">DINOS DELUXE</p> 
            <p className="sub-text">
              3000 dinos vibing moments before the meteor hits.
            </p>
            <br />
            {currentAccount === "" ? (
              <button onClick={connectWallet} className="cta-button connect-wallet-button">
                CONNECT
              </button>
            ) : [
              (!isMintActive ? (
                <div className="button-container">
                  <button className="cta-button connect-wallet-button">
                    OPEN SOON
                  </button>
                </div>
                  ) : null
              ),
              (isMintActive ? (
                  <div className="mint-options">
                    <br />
                    <div className="mint-specific">
                      <button onClick={mint} className="cta-button connect-wallet-button">
                        MINT DINOS
                      </button>
                      <div className="mint-quantity">
                        <textarea 
                          name = "numDadMfers"
                          type="text"
                          id="numMfers"
                          className="textarea-entry"
                          placeholder="max 20"
                          onChange={e => setNumMfers(e.target.value)}
                        >
                        </textarea>
                        </div>
                    </div>
                  </div>
                  ) : null
              ),
            ]}
            <br />
            <p className="smol-text">
              FIRST 500 FREE, THEN 0.03 ETH
            </p>
            <p className="smol-text">
            {currentAccount !== "" ? (
              <b>MINTED: {totalSupply} / 3000</b>
            ) : (
              <b>CONNECT</b>
            )}
            </p>
            <div className="minting-container">
              <div className="minting-image">
              </div>
              <div className="minting-amount">
                <img src={dino1gif} className="art-gif-preview" />
                <p className="supply">Dinos Deluxe</p>
                {currentAccount !== "" ? (
                  <p className="supply">{totalSupply} / 3000</p>
                ) : (
                  <p className="supply">CONNECT</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-container">
        </div>
      </div>
      <div id="art" className="container art-container">
        <div className="horizontal-divider"></div>
        <div className="gradient-text art-title">
          Art
        </div>
        <br />
        <p className="sub-text">There are 10 ultra <b>Legendary Galaxy Dinos</b></p>
        <br />
        <div className="art-preview-container">
            <img src={dino1} className="art-gif" />
            <img src={dino2} className="art-gif" />
            <img src={dino3} className="art-gif" />
        </div>
        <br />
        <p className="sub-text">And 3000 <b>Dino Deluxes</b></p>
        <br />
        <div className="art-preview-container">
          <img src={sample1} className="art-sample" />
          <img src={sample2} className="art-sample" />
          <img src={sample3} className="art-sample" />
          <img src={sample4} className="art-sample" />
        </div>
        <div className="art-preview-container">
          <img src={sample5} className="art-sample" />
          <img src={sample6} className="art-sample" />
          <img src={sample7} className="art-sample" />
          <img src={sample8} className="art-sample" />
        </div>
    
      </div>
      <div id="package" className="container package-container">
        <div className="horizontal-divider"></div>
        <div className="gradient-text package-title">
          WHAT YOU GET
        </div>
        <p className="sub-text"><b>It's more than a PFP...</b></p>
        <div className="artbooks-div">
          <img src={artbook1} className="artbook-img" />
          <img src={artbook2} className="artbook-img" />
        </div>
        <p className="sub-text">+ Unique Dino <b>NFT</b></p>
        <p className="sub-text">+ One-Way Ticket to <b>Dinotopia Game</b></p>
        <p className="sub-text">+ Autographed Dinos Deluxe <b>Artbook</b></p>
      </div>
      <div id="utility" className="container roadmap-container">
        <div className="horizontal-divider"></div>
        <div className="gradient-text roadmap-title">
          Utility
        </div>
        <br />
        <div className="dino-container">
          <p className="sub-text">All holders of Dinos Deluxe will get access to <b>Dinotopia</b></p>
          <img className="dinotopia-img" src={dinotopiaIsReal} />  
          <p className="sub-text">Dinotopia is a unique P2E gaming experience reliving the great extinction, who will be the last dinosaur on earth?</p>
          {currentBalance > 0 ? (
            <div className="unlockables" >
              <div className="horizontal-divider"></div>
              <a href="https://dinosdeluxe.itch.io/dinos-deluxe">
                <img src={dinoverseticket} className="dino-ticket-img" />
              </a>
              <a href="https://ipfs.io/ipfs/Qmeed4613gU6ewdUiUoe3wJpvXShAcTtkK2ynBDND7PnTS">
                <img src={dinoverseartbook} className="dino-art-book-img" />
              </a>
              <div className="horizontal-divider"></div>
            </div>
          ) : (
            <button onClick={updateBalance} className="cta-button connect-wallet-button dinotopia-ticket">
              MINT FOR A TICKET TO DINOTOPIA
            </button>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="footer">
        <div className="footer-container-bottom">
          <a href="#mint">
            <a href="https://twitter.com/dinosdeluxe">
              <img className="logo-footer-button" src={OpenseaLogo} />  
            </a>
          </a>
          <a className="vertical-line"></a>
          <a href="https://twitter.com/dinosdeluxe">
            <img className="twitter-button" src={TwitterLogo} />  
          </a>
          {/* <a href="https://discord.gg/KJaJ9g9x"><img className="discord-button" src={DiscordLogo} />  </a> */}
        </div>
      </div>
    </div>
  );
};

export default App;  