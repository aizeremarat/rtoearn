import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import RunToEarnABI from '../contracts/RunToEarn.json'; // Replace with your ABI file path

const ActivityTracker = ({ userAccount }) => {
  const [distance, setDistance] = useState(0);
  const [lastPosition, setLastPosition] = useState(null);
  const [rewards, setRewards] = useState(0);
  const contractAddress = "0x9aEDE5a288C23aC398Bb28fcC73084Eb63164281"; // Replace with actual address
  const web3 = new Web3(window.ethereum);

  const runToEarnContract = new web3.eth.Contract(RunToEarnABI, contractAddress);

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      if (lastPosition) {
        const dist = calculateDistance(lastPosition, { latitude, longitude });
        setDistance(prev => prev + dist);
      }
      setLastPosition({ latitude, longitude });
    });
  };

  const calculateDistance = (pos1, pos2) => {
    // Haversine formula to calculate distance between two points
    const R = 6371e3; // Radius of Earth in meters
    const lat1 = (pos1.latitude * Math.PI) / 180;
    const lat2 = (pos2.latitude * Math.PI) / 180;
    const dLat = lat2 - lat1;
    const dLon = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dLon / 2) ** 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) / 1000; // Distance in km
  };

  const logActivity = async () => {
    if (contract) {
        try {
            await contract.methods.logActivity(distance).send({ from: account });
            alert('Activity logged!');
        } catch (error) {
            console.error('Error logging activity:', error.message || error);
            alert('An error occurred while logging activity. Check the console for details.');
        }
    }
};

const calculateRewards = async () => {
    if (contract) {
        try {
            const reward = await contract.methods.calculateRewards(distance).call();
            setRewards(reward);
        } catch (error) {
            console.error('Error calculating rewards:', error.message || error);
            alert('An error occurred while calculating rewards. Check the console for details.');
        }
    }
};


  useEffect(() => {
    const positionInterval = setInterval(getCurrentPosition, 5000); // Check position every 5 seconds
    return () => clearInterval(positionInterval);
  }, [lastPosition]);

  return (
    <div>
      <h2>Distance Tracked: {distance.toFixed(2)} km</h2>
      <h2>Rewards: {rewards.toFixed(2)} RUN</h2>
      <button onClick={logActivity}>Log Activity</button>
    </div>
  );
};

export default ActivityTracker;
