import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import contractABI from  '../../blockchain/artifacts/contracts/Token.sol/Token.json';
import {MerkleTree} from 'merkletreejs';
import  keccak256  from 'keccak256';

export default function Home() {

  //hardhat deployment
  //const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  //Goerli deployment
  const contractAddress = "0x4c1C26a20E29e99F0237825258083600d0570D1B";

  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState(undefined);

  
  const handleAddressChange = ({ target }) => {
    setAddress(target.value);
  };
  
  async function connect(){
    if(typeof window.ethereum !== "undefined"){
      try {
        await ethereum.request({ method : "eth_requestAccounts"});
        setIsConnected(true);
        let connectedProvider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(connectedProvider.getSigner());
      } catch (error) {
        console.log(error)
      }
    }else{
      alert("Please install and connect Metamask first");
      setIsConnected(false);
    }
  }

  async function updateWitheList(){    
    const merkleTree = await prepareMerkleTree(address)
    const rootHash = '0x' + merkleTree.getRoot().toString('hex');
    console.log("Whitelist Merkle Tree: \n", merkleTree.toString());
    console.log("Merkle Root Hash:", rootHash);

    try {
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      await contract.updateWitheList(rootHash);
      console.log("updatedWitheList function called successfully");
    } catch (error) {
      console.log(error)
    }
  }

  async function prepareMerkleTree(newAddress ){
    let addresses = JSON.parse(localStorage.getItem("addresses"));
    if (!addresses ){
      addresses = [];
    }
    if(newAddress){
      addresses.push(newAddress);
      localStorage.setItem("addresses", JSON.stringify(addresses));
    }        
    console.log(localStorage.getItem("addresses"));
    const leafNodes = addresses.map( add => keccak256(add));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs : true});
    return merkleTree
  }

  async function callMint(){      
      try {        
        const signerAddress  =  window.ethereum.selectedAddress;
        const merkleTree = await prepareMerkleTree();
        const hexProof = merkleTree.getHexProof(keccak256(signerAddress));
        console.log("HexProof: ", hexProof);

        const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
        const receiver =  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        const amount = 1;
        await contract.mint(hexProof, receiver, amount);
        console.log("Mint function called successfully");
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Hello NFT</title>
        <meta name="description" content="Hello NTF" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Code Challenge          
        </h1>    

        <div className={styles.grid} >
          <a href="#" className={styles.card} onClick={() => connect()} >            
            <h2>{ isConnected ? "Connected!" : "Connect" }</h2>
            <p>Connect MetaMask <br /><br /></p>
          </a>

          <a className={styles.card} >
            <h2>Add to whitelist</h2>
            <form action="/send-data-here" method="post">
              <label for="first">Address:</label>
              <input type="text" id="address" name="address"
                onChange={handleAddressChange}
                value={address}
                 />
              <button type="button" onClick={()=>updateWitheList()}>Send</button>
            </form>
          </a>

          <a href="#" className={styles.card} onClick={() => callMint()} >
            <h2>Mint NFT </h2>
            <p>Execute the target function.</p>
          </a>          

        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
