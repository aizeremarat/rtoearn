// src/components/MapComponent.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 51.0869723, // Default center location
  lng: 71.4303575
};

const MapComponent = () => {
  const [location, setLocation] = useState(center);
  const [details, setDetails] = useState("");
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCoyUfc7tJ2xN9luti2Q76meWlfvke-dVM', // Replace with your Google Maps API Key
  });

  useEffect(() => {
    let recount = 0;

    const successCallback = (position) => {
      const { accuracy, latitude, longitude, altitude, heading, speed } = position.coords;
      recount++;
      setDetails(`Accuracy: ${accuracy}<br>
                  Latitude: ${latitude} | Longitude: ${longitude}<br>
                  Altitude: ${altitude}<br>
                  Heading: ${heading}<br>
                  Speed: ${speed}<br>
                  Req Count: ${recount}`);
      
      setLocation({ lat: latitude, lng: longitude });
    };

    const errorCallback = (error) => {
      console.error("Error getting location: ", error);
    };

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };

    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={15}
      >
        <Marker position={location} />
      </GoogleMap>
      <div dangerouslySetInnerHTML={{ __html: details }} />
    </div>
  ) : null;
};

export default MapComponent;
