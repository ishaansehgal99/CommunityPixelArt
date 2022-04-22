import logo from './logo.svg';
import './App.css';
import Web3Modal from "web3modal";
import { ethers, Contract } from "ethers";
import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';

const { abi } = require('./artifacts/contracts/PixelToken.json'); 

function App() {

  const [pixelInput, setPixelInput] = useState('');
  const [logMessage, setLogMessage] = useState(''); 
  const [tokens, setTokens] = useState({});
  const [contract, setContract] = useState(''); 

  const initWeb3 = async () => {
    
    return new Promise(async (resolve, reject) => {
      const web3Modal = new Web3Modal({
        cacheProvider: true
      });

      const connection = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(connection);

      const { chainId } = await provider.getNetwork();
      console.log("ISHAAN", chainId);

      const signer = provider.getSigner();

      const contract = new Contract('0x5f3742Cc230e9F70f70Cf87569Bd4c8eBcFf87c6', abi, signer);

      resolve({contract});

    }); 
  }

  const mintToken = async (tokenName) => {
    if(!tokenName) return;
    contract.mintToken(tokenName).then((tx) => {
      tx.wait().then(() => {
        setLogMessage('Token Minted');
      })

    }).catch((err) => setLogMessage(err.message));
  }

  const getAllTokens = async () => {
    const tokens = await contract.getAllTokens();
    setTokens(tokens);
  }

  const getMyTokens = async () => {
    const myTokens = await contract.getMyTokens(); 
    setTokens(myTokens); 
  }

  useEffect(() => {
    initWeb3().then(async ({contract}) => {
      setContract(contract); 

      // getAllTokens();
      const tokens = await contract.getAllTokens();
      setTokens(tokens); 


    }).catch((err) => {
      console.log(err); 
      setLogMessage(err); 
    })

  }, []); 

  return (
    <div className="App">
      <header className ="App-Header">
        <h1>Mint Pixel Token</h1> 

        <form>
          <TextField type = "text" onChange={(e) => setPixelInput(e.target.value)}>

          </TextField>

          <Button onClick = {() => mintToken(pixelInput)}>Mint</Button>
        </form>

        <br />

        <div>
          <Button onClick = {getMyTokens}>My Minted Tokens</Button>

          <Button onClick = {getAllTokens}>All Tokens</Button>
        </div>

        <br />
        <div>
          {console.log(tokens)}
          {
          tokens.length ? tokens.map(({ tokenId, tokenName, owner}, i) => (

            <div key = {i} className = "token">

              <div>Token Id: {tokenId}</div>
              <div>Token Name: {tokenName}</div>
              <p>Owner: {owner}</p>
              

            </div>  
          )) : <p>No Tokens</p>
          }
        </div>
      </header>



    </div>
  );
}

export default App;
