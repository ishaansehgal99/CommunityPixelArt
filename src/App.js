import logo from './logo.svg';
import './App.css';
import Web3Modal from "web3modal";
import { ethers, Contract } from "ethers";
import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';



import ColorPicker from './components/ColorPicker'

const { abi } = require('./artifacts/contracts/PixelToken.json'); 

function App() {

  const [pixel2Color, setPixel2Color] = useState(new Map());
  // const [pixelRInput, setPixelRInput] = useState(0);
  // const [pixelGInput, setPixelGInput] = useState(0);
  // const [pixelBInput, setPixelBInput] = useState(0);

  const [color, setColor] = useState('');

  const [logMessage, setLogMessage] = useState(''); 
  const [tokens, setTokens] = useState({});
  const [contract, setContract] = useState(''); 
  const [userAddress, setUserAddress] = useState(''); 

  const GRID_ROW_LENGTH = 10; 
  const GRID_COL_LENGTH = 10;

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

      const contract = new Contract('0x4C2805F2d78423907bB7DA38daFb506124F04EA5', abi, signer);

      resolve({contract});

    }); 
  }

  const mintToken = async () => {
    contract.mintToken().then((tx) => {
      tx.wait().then(() => {
        console.log("Token minted");
        setLogMessage('Token Minted');
      })

    }).catch((err) => setLogMessage(err.message));
  }

  const getAllTokens = async () => {
    console.log("GALL");
    const tokens = await contract.getAllTokens();
    setTokens(tokens);
    console.log("set TOKENS");
  }

  const getMyTokens = async () => {
    const myTokens = await contract.getMyTokens(); 
    setTokens(myTokens); 
  }

  const getUserAddress = async () => {
    const address = await contract.getUserAddress();
    setUserAddress(address); 
  }

  function getPixel2ColorValue(key) {
    return pixel2Color.get(key) || "256,256,256";
  }

  const burnToken = async (tokenId) => {
    console.log(tokenId);
    const burnSuccess = await contract.burnToken(tokenId);
    if(burnSuccess){
      console.log(color);

      setPixel2Color(new Map(
        pixel2Color.set(tokenId, `rgba(${color['r']},${color['g']},${color['b']},${color['a']})`)
        ));

      console.log(pixel2Color);

      await getAllTokens();
      
    }
  }

  const createGrid = () => {
      const grid = [];
      const initColorMap = {}
      for (let row = 0; row < GRID_ROW_LENGTH; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_COL_LENGTH; col++) {
          const idx = row * GRID_ROW_LENGTH + col;
          currentRow.push(idx);
          // initColorMap[idx] = 'black'; 
        }
        grid.push(currentRow);
      }
      // console.log(initColorMap);
      return grid;
  }

  useEffect(() => {
    initWeb3().then(async ({contract}) => {
      setContract(contract); 

      // getUserAddress();
      const address = await contract.getUserAddress();
      setUserAddress(address); 

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

        <div className="grid">
        {createGrid().map((row, rowId) => {
          return (
            <div key={rowId}>
              {row.map((node, nodeId) => {
                return (
                  <div key={node} style={{background:`${getPixel2ColorValue(node)}`}} className="node"></div>
                );
              })
            }
           </div>
          )
        })}
        </div>

        <form>
          <Button onClick = {() => mintToken()}>Mint Token</Button>
        </form>

        <br />

        <div>
          <Button onClick = {getMyTokens}>My Minted Tokens</Button>

          <Button onClick = {getAllTokens}>All Tokens</Button>
        </div>

        <br />
        <div>
          {console.log(tokens, userAddress)}
          {
          tokens.length ? tokens.map(({tokenId, tokenName, owner}, i) => (

            <div key = {i} className = "token">

              <br />
              <div>Token Id: {parseInt(tokenId._hex, 16)}</div>
              <div>Token Name: {tokenName}</div>
              <p>Owner: {owner}</p>


              {owner === userAddress &&
                <div style = {{marginLeft: 'auto', marginRight: 'auto', textAlign:'center'}}>
                   <div>
                   <ColorPicker changeColor={setColor}/>

                  <br />

                 
                    <span style={{marginRight:'20px'}}>Red </span>
                    <TextField type = "text" value={color['r']} /*onChange={(e) => setPixelRInput(e.target.value)}*/></TextField>
                    <br />
                    <span style={{marginRight:'20px'}}>Green</span>
                    <TextField type = "text" value={color['g']}/*onChange={(e) => setPixelGInput(e.target.value)}*/></TextField>
                    <br />
                    <span style={{marginRight:'20px'}}>Blue</span>
                    <TextField type = "text" value={color['b']}/*onChange={(e) => setPixelBInput(e.target.value)}*/></TextField>
                    <br />
                    <span style={{marginRight:'20px'}}>Alpha</span>
                    <TextField type = "text" value={color['a']}/*onChange={(e) => setPixelBInput(e.target.value)}*/></TextField>
                    <br />
                    <Button onClick = {() => burnToken(parseInt(tokenId._hex, 16))}>Burn Token</Button>
                  </div>
                </div>
              } 
              

            </div>  
          )) : <p>No Tokens</p>
          }
        </div>
      </header>



    </div>
  );
}

export default App;
