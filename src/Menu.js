import './styles/App.css';
import './styles/Menu.css';
import React, { useEffect, useState } from "react";

// import HopeDaoLogoSmall from './assets/logo192.png';

// import contractABI from './utils/MyEpicNFT.json';
import { deploy } from "./scripts/deploy.js";
import { ethers } from "ethers";

const Menu = () => {
  const [currentAccount, setCurrentAccount] = useState("");

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
      } else {
        const accounts = await ethereum.request({ method: "eth_requestAccounts"});

        if (accounts.length !== 0) {
          const account = accounts[0];
          setCurrentAccount(account);
          console.log("have account", account);
          window.location.reload(false);
        } else {
          console.log("no accounts!");
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
      <header className="menu">
        <div className="menu-center">  
          <a href="/">
          {/* <img src={HopeDaoLogoSmall}  alt="hopedaologo" className="menu-logo"/> */}
          </a>
          <div className="menu-link-div">
            <a className="menu-link" href="#mint">
              Mint
            </a>
          </div>
          <a className="vertical-line"></a>
          <div className="menu-link-div">
            <a className="menu-link" href="#art">
              Art
            </a>
          </div>
          <a className="vertical-line"></a>
          <div className="menu-link-div">
            <a className="menu-link" href="#utility">
              Utility
            </a>
          </div>
        </div>
        <div className="menu-right">
        {currentAccount==="" ? 
          <button onClick={connectWallet} className="button-truncate top-menu-connect-button connect-wallet-button">
            CONNECT
          </button> : 
        <button className="button-truncate top-menu-button-disabled connect-wallet-button">
        {currentAccount}
        </button>
        }
      
      </div>
    </header>
  )
};

export default Menu;