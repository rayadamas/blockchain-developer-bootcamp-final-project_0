import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/sardaukarchant.json';
// abi(Application Binary Interface) instruction found in README.md

const App = () => {
  /*
  * A state variable used to store the user's public wallet address
  */
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * All state property to store all waves
   * `contractAddress` is retrieved from user's terminal output after deployment to Rinkeby Testnet
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x53E47439455BaA44eE92E8172AB7aE677613BA06";
  const contractABI = abi.abi;

  /*
   * `getAllWaves` will retrieve all CHANTS from our contract
   */
  const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      // `waves` will call `getAllWaves` method from our Smart Contract
      const waves = await wavePortalContract.getAllWaves();

      // address, timestamp, & message are all that is needed for this UI
      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });
      // `setAllWaves` will store data within React State
      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * We listen for the `emit`s of `event`s
 * `NewWave` functions similar to a webhook
 * `setAllWaves` will ensure the user's msg is automatically appended to the `allWaves` Array when the event is
 * received. The UI will update to reflect such.
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log('NewWave', from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on('NewWave', onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off('NewWave', onNewWave);
    }
  };
}, []);
  
  /*
  * We ensure we have access to `window.ethereum`
  */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * `accounts` will check whether we are authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
  * Function to connect to user's wallet
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        /*
        * The `ethers` library helps the frontend talk to our contract.
        `providers` permit communication with Ethereum nodes.
        
        A `Signer` in `ethers` is an abstraction of an ETH account used to sign
        messages & Txns + send Txns to the Ethereum Network to execute state changing operations.

        `contractABI` is used here

        `waveTxn` is the actual CHANT from our smart contract

        */
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave("CHANT FOR THE MAKER", { gasLimit: 300000 });
        // with `gasLimit` we force the user to pay 300K gas, if all is not used it is refunded
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  /*
  * `useEffect()` runs our function `checkIfWalletIsConnected` when the page loads
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  // HTML Code //
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          🩸SARDAUKAR BOOTCAMP🩸
        </div>

        <div className="bio">
          WE ONLY PRAY AND CHANT
        </div>

        <button className="waveButton" onClick={wave}>
          CHANT
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            CONNECT TO MAKER
          </button>
        )}

        {/* `allWaves.map` will render our UI data for viewing */}
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App