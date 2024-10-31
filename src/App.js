import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import contractData from './contracts/RunToEarn.json'; // Adjust the path to your ABI JSON
import Login from './components/Login'; // Import the Login component
import MapComponent from './components/Map';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [distance, setDistance] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [activities, setActivities] = useState([]);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null }); // New state for coordinates

  const abi = contractData.abi;
  const contractAddress = '0x9aEDE5a288C23aC398Bb28fcC73084Eb63164281'; // Replace with your contract address

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const contractInstance = new web3.eth.Contract(abi, contractAddress);
        setContract(contractInstance);
      } else {
        console.error('Please install MetaMask!');
      }
    };

    if (account) {
      initWeb3();
    }
  }, [account, abi, contractAddress]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude }); // Update state with coordinates
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error('Error occurred: ' + error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const logActivity = async () => {
    if (contract) {
      await contract.methods.logActivity(distance).send({ from: account });
      setActivities([...activities, { distance, date: new Date().toLocaleString() }]);
      alert('Activity logged!');
    }
  };

  const calculateRewards = async () => {
    if (contract) {
      const reward = await contract.methods.calculateRewards(distance).call();
      setRewards(reward);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <div>
      <h1>Your DApp</h1>

      {!account ? (
        <Login connectWallet={connectWallet} />
      ) : (
        <>
          <p>Connected Account: {account}</p>
          <button onClick={getLocation}>Get My Location</button>
          {coordinates.latitude && (
            <p>Location: {coordinates.latitude}, {coordinates.longitude}</p>
          )}
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Enter distance (km)"
          />
          <button onClick={logActivity}>Log Activity</button>
          <button onClick={calculateRewards}>Calculate Rewards</button>
          <p>Rewards: {rewards}</p>

          <h2>Activity Log</h2>
          <ul>
            {activities.map((activity, index) => (
              <li key={index}>
                {activity.distance} km - {activity.date}
              </li>
            ))}
          </ul>

          {/* Integrate the Map Component here */}
          <MapComponent />
        </>
      )}
    </div>
  );
};

export default App;
