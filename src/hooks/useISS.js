import { useState, useEffect, useCallback } from 'react';
import { fetchISSLocation, fetchAstronauts, fetchLocationName } from '../services/api';
import { calculateSpeed } from '../utils/haversine';
import toast from 'react-hot-toast';

export const useISS = () => {
  const [issData, setIssData] = useState({
    current: null,
    history: [],
    speedHistory: [],
    speed: 0,
    locationName: 'Loading...',
    astronauts: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLocation = useCallback(async () => {
    try {
      const data = await fetchISSLocation();
      const pos = {
        lat: parseFloat(data.iss_position.latitude),
        lng: parseFloat(data.iss_position.longitude),
        timestamp: data.timestamp
      };

      setIssData(prev => {
        let newSpeed = data.velocity || prev.speed;
        let speedData = null;
        if (!data.velocity && prev.current) {
          const timeDiff = Math.abs(pos.timestamp - prev.current.timestamp);
          newSpeed = calculateSpeed(prev.current, pos, timeDiff);
        }
        
        // Update speed history
        if (newSpeed > 0 && newSpeed < 40000) {
          speedData = { time: new Date(pos.timestamp * 1000).toLocaleTimeString(), speed: Math.round(newSpeed) };
        }

        const newHistory = [...prev.history, pos].slice(-15);
        const newSpeedHistory = speedData 
          ? [...prev.speedHistory, speedData].slice(-30)
          : prev.speedHistory;

        return {
          ...prev,
          current: pos,
          history: newHistory,
          speedHistory: newSpeedHistory,
          speed: newSpeed > 0 && newSpeed < 40000 ? newSpeed : prev.speed
        };
      });

      // Fetch location name
      const locName = await fetchLocationName(pos.lat, pos.lng);
      setIssData(prev => ({ ...prev, locationName: locName }));
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch ISS location');
      toast.error('Failed to fetch ISS location');
    }
  }, []);

  const fetchAstros = useCallback(async () => {
    try {
      const data = await fetchAstronauts();
      setIssData(prev => ({
        ...prev,
        astronauts: {
          number: data.number,
          names: data.people.map(p => p.name)
        }
      }));
    } catch (err) {
      console.error("Failed to fetch astronauts");
    }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchAstros();
      await fetchLocation();
      setLoading(false);
    };
    init();
  }, [fetchLocation, fetchAstros]);

  // Auto refresh
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchLocation();
      }, 15000); // 15 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLocation]);

  const manualRefresh = async () => {
    setLoading(true);
    await fetchLocation();
    setLoading(false);
    toast.success('ISS Location refreshed');
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
    toast.success(`Auto-refresh ${!autoRefresh ? 'enabled' : 'disabled'}`);
  };

  return { issData, loading, error, autoRefresh, manualRefresh, toggleAutoRefresh };
};
