import React, { useState } from 'react';
import Web3 from 'web3';

const Auth = ({ onAuthSuccess }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        onAuthSuccess(accounts[0]); // Pass the authenticated account back to parent
      } catch (error) {
        console.error("User denied wallet connection:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  return (
    <div>
      {account ? (
        <p>Connected as: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default Auth;
