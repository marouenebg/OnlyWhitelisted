import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract, constants } from "ethers";
import { useEffect, useRef, useState } from "react";
import {abi, WHITELIST_CONTRACT_ADDRESS} from "../constants";
import { setLazyProp } from "next/dist/server/api-utils";

export default function Home() {

//Use state to test if the wallet is connected or no
 const [walletConnected, SetWalletConnected] = useState(false);

//JointedWhitelist keep track if the user joined the whitelist or no   
const [JointedWhitelist, SetJointedWhitelist] = useState(false);

//Loading is set to true when we are waiting for a transaction
const [Loading, SetLoading] = useState(false);

//NumberofWhitelisted track the number of whitelisted addresses in the contract
const [NumberofWhitelisted, SetNumberofWhitelisted] = useState(0);

//UseRef for the Web3Modal which persist as long as the page is open
const web3ModalRef = useRef();

/**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */

const  getSignerOrProvider = async (needSigner = false) => {
//we need to access the `current` value to get access to the underlying object
const provider = await web3ModalRef.current.connect();
const web3provider = new providers.Web3Provider(provider);

//if user is not conencted to the goerli netwrok, throw an error 
const { chainId } = await web3provider.getNetwork();
if (chainId != 5) {
    window.alert("Change the network to Goerli");
    throw new Error("Change network to Goerli");    
}

if (needSigner) {
    const signer = web3provider.getSigner();
    return signer;    
}
return web3provider;

};

const addAddressToWhitelist = async () => {

try {
//get a signer, because we will modify the state of the smart contract
const signer = await getSignerOrProvider(true);
const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
const tx = await whitelistContract.addAddressToWhitelist();
SetLoading(true);

//wait for the transaction to get mined
tx.wait();
SetLoading(false);

await getNumberOfWhitelisted();
SetJointedWhitelist(true);
}
catch(err) {
    console.error(err);
}
};

const getNumberOfWhitelisted = async () => {
try {
//get a provider to read from the contract
const provider = await getSignerOrProvider(false);
const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);

const _numberOfwhitelisted = await whitelistContract.NumberWhitelistedAddresses();
SetNumberofWhitelisted(_numberOfwhitelisted);
}catch(err) {
    console.error(err);
  }
};

const checkAddressInWhitelist = async () => {
  try {
const provider = await getSignerOrProvider(true);
const address = await provider.getAddress()
const WhitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);

const IsWhitelistAddress = await WhitelistContract.WhitelistedAddress(address);
SetJointedWhitelist(true);
}catch(err) {
  console.log(err);
}
};
const connectWallet = async () => {
  try {
await getSignerOrProvider(true);
SetWalletConnected(true);

getNumberOfWhitelisted();

} catch(err) {
  console.error(err);
}
};

//rederButton returns a button based of the state of the app
const renderButton = () => {
    if (walletConnected) {
      if (JointedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (Loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };


useEffect(() => {

// the use effect will be triggered based on the wallet connection

if (!walletConnected) {
  web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
  connectWallet();
    }
 }, [walletConnected]);

return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            {/* Using HTML Entities for the apostrophe */}
            It&#39;s an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {JointedWhitelist} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}

// Connect your wallet
// we have web3Modal, so we should call it


// see how many are in the whitelist
// we should have ABI of the contract and its address, so that we will be able to read it using ethers

// am i eligible ( already exist in the whitelist)
// read the mapping in the contract, if its possible  ( mapping (address => bool ) public  WhitelistedAddress;)

// apply for whitelist
// send a request to to the contract using the addAddressToWhitelist() function