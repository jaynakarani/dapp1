import { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import { loadContract } from './utils/load';
import detectEthereumProvider from "@metamask/detect-provider"
import contract from '@truffle/contract';

function App() {
  const [web3api, setweb3api] = useState({
    provider: null,
    web3: null,
    contract: null
  });
   
  const [account,setaccount] =  useState(null)
  const [balance,setbalance]=useState(null);
  const [reload,shouldrreload]=useState(false);

const reloadeffect =  ()=>shouldrreload(!reload)

  useEffect(() => {
    const loadProvider = async () => {
      // console.log(window.web3);
      // console.log(window.ethereum);
      const provider = await detectEthereumProvider();
      const contract = await loadContract("funder",provider)
      if(provider){
        provider.request({method:"eth_requestAccounts"});
        setweb3api({
          web3: new Web3(provider),
          provider,
          contract
        })
      }
      else{
        console.error("install meta-mask")
      } 
      // if (window.ethereum) {
      //   provider = window.ethereum
      //   try {
      //     await provider.enable();
      //   }
      //   catch {
      //     console.log("error vo bi badi vali")
      //   }
      // }
      // else if (window.web3) {
      //   provider = window.web3.currentProvider;
      // }
      // else if (!process.env.production) {
      //   provider = new Web3.providers.HttpProvider("http://localhost:7545")
      // }

      
    };
    loadProvider()
  }, []);
  useEffect(()=>{
    const loadbalance = async()=>{
      const{contract,web3}=web3api;
      const balance = await web3.eth.getBalance(contract.address);
      setbalance(web3.utils.fromWei(balance,"ether"));
    }
     web3api.contract && loadbalance();
  },[web3api,reload]);

  const Transferfund = async()=>{
    const {web3,contract}= web3api;
    await contract.trasfer({
      from:account,
      value:web3.utils.toWei("2","ether"),
    });
    reloadeffect();
  }

const withdrawfund = async()=>{
  const {contract,web3}=web3api;
  const withdrawAmount = web3.utils.toWei("2","ether");
  await contract.withdraw(withdrawAmount,{ 
    from:account
  })
  reloadeffect()
}

  useEffect(()=>{
    const getaccount = async()=>{
      const accounts =await web3api.web3.eth.getAccounts()
      setaccount(accounts[0])
    }
    web3api.web3 && getaccount()
  },[web3api.web3])

  // console.log(account)
  return (
    <>
      <div className="card text-center">
        <div className="card-header">Funding</div>

        <div className="card-body">
          <h5 className="card-title">Balance: {balance} ETH </h5>
          <p className="card-text">Account : {account ? account:"not connected"} </p>
          {/* <button type="button" className="btn btn-success mx-1" onClick={async()=>{
          // metamask mathi account address leva
          const accounts = await window.ethereum.request({method:"eth_requestAccounts"})
          console.log(accounts)
        }}>
          Connect to metamask
        </button> */}
          <button type="button" className="btn btn-success mx-1 " onClick={Transferfund} >
            Transfer
          </button>
          <button type="button" className="btn btn-primary mx-1" onClick={withdrawfund}>
            Withdraw
          </button>
        </div>
        <div className="card-header">JAY NAKARANI</div>
      </div>
    </>
  );
}
export default App;
