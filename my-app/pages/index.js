import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useRef, useState } from "react";
import {abi, NFT_CONTRACT_ADDRESS} from '../constants'
import Web3 from "web3";

export default function Home() {
  // tokenIdsMinted keeps track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");

  useEffect(() => {
      // set an interval to get the number of token Ids minted every 5 seconds
      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 * 1000);
  },[]);

  /**
   * getTokenIdsMinted: gets the number of tokenIds that have been minted
   */
    const getTokenIdsMinted = async () => {
      try {
        // Get the provider from web3Modal, which in our case is MetaMask
        const provider = await getProvider();
        // We connect to the Contract using a Provider,
        const nftContract = new provider.eth.Contract( abi, NFT_CONTRACT_ADDRESS);
        // call the tokenIds from the contract
        const _tokenIds = await nftContract.methods.tokenIds().call();
        console.log("tokenIds", _tokenIds);
        //_tokenIds is a `Big Number`. We need to convert the Big Number to a string
        setTokenIdsMinted(_tokenIds.toString());
      } catch (err) {
        console.error(err);
      }
    };

  async function getProvider() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        return web3;
      } catch (error) {
        throw error;
      }
    }
  }

  const publicMint = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const web3Provider = await getProvider();
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const accounts =  await web3Provider.eth.getAccounts();
      console.log(accounts);
      console.log(web3Provider.eth.defaultAccount);
      const nftContract = new web3Provider.eth.Contract(abi, NFT_CONTRACT_ADDRESS,{from: accounts[0]});
      // call the mint from the contract to mint the StepUpNFT
      // wait for the transaction to get mined
      const tx = await nftContract.methods.mint().send({
        // value signifies the cost of one StepUpNFT which is "0.0001" eth.
        // We are parsing `0.0001` string to ether using the utils library from ethers.js
        value: web3Provider.utils.toWei("0.0001","ether"),
      });
      console.log(tx);
      window.alert(`You successfully minted StepUpNFT  ${tx.events.Transfer.returnValues[2]} to  ${tx.events.Transfer.returnValues[1]}` );
    } catch (err) {
      console.error(err);
    }
  };
  
  /*
        renderButton: Returns a button based on the state of the dapp
      */
  const renderButton = () => {

    return (
      <button className={styles.button} onClick={publicMint}>
        Public Mint 🚀
      </button>
    );
  };

  return (
    <div>
      <Head>
        <title>STUNFT</title>
        <meta name="description" content="STUNFT-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to STUNFT!</h1>
          <div className={styles.description}>
            Its an NFT collection for  students.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/10 have been minted
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./0.svg" />
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by StepUpNFT</footer>
    </div>
  );
}
