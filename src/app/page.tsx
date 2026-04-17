"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, IconButton, Snackbar, Alert, Paper } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

// Components
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import Forecast from '@/components/Forecast';
import Loader from '@/components/Loader';

import { useThemeContext } from '@/components/ThemeRegistry';
import { 
  WeatherData, 
  ForecastData, 
  fetchWeatherByCity, 
  fetchWeatherByCoords, 
  isApiKeySet 
} from '@/services/weatherService';

export default function Home() {
  const { mode, toggleTheme } = useThemeContext();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);

  const handleSearch = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data.current);
      setForecast(data.forecast);
      localStorage.setItem('lastSearchedCity', city);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocationSearch = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          setWeather(data.current);
          setForecast(data.forecast);
          localStorage.setItem('lastSearchedCity', data.current.city);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch weather for your location.');
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        console.error(geoError);
        setError('Failed to get your location. Please search manually.');
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!isApiKeySet()) {
      setError("OpenWeather API key is not configured in .env.local");
      setLoading(false);
      return;
    }

    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
      handleSearch(lastCity);
    } else {
      // If no history, attempt to get location, otherwise default to a major city like 'London'
      if (navigator.geolocation) {
        handleLocationSearch();
      } else {
        handleSearch('London');
      }
    }
  }, [handleSearch, handleLocationSearch]);

  const getDynamicBackgroundClass = () => {
    if (!weather) return '';
    const condition = weather.condition.toLowerCase();
    
    if (condition.includes('clear')) return mode === 'light' ? 'bg-clear-light' : 'bg-clear-dark';
    if (condition.includes('cloud')) return mode === 'light' ? 'bg-clouds-light' : 'bg-clouds-dark';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'bg-rain';
    if (condition.includes('snow')) return 'bg-snow';
    if (condition.includes('thunderstorm')) return 'bg-thunder';
    
    return '';
  };

  return (
    <Box 
      className={getDynamicBackgroundClass()}
      sx={{ 
        minHeight: '100vh', 
        pt: { xs: 4, md: 8 }, 
        pb: 8,
        transition: 'background-image 0.5s ease-in-out'
      }}
    >
      <Container maxWidth="md">
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              background: mode === 'light' 
                ? 'linear-gradient(45deg, #1e3a8a 30%, #3b82f6 90%)' 
                : 'linear-gradient(45deg, #93c5fd 30%, #60a5fa 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Weather.
          </Typography>
          
          <IconButton onClick={toggleTheme} color="inherit" sx={{ className: 'glass-card' }}>
            {mode === 'dark' ? <LightModeIcon sx={{ color: '#fbbf24' }} /> : <DarkModeIcon sx={{ color: '#1e3a8a' }} />}
          </IconButton>
        </Box>

        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch} 
          onLocationSearch={handleLocationSearch} 
          isLoading={loading} 
        />

        {/* Content Section */}
        {loading ? (
          <Loader />
        ) : weather ? (
          <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            <WeatherCard data={weather} />
            <Forecast data={forecast} />
          </Box>
        ) : (
          !error && (
            <Paper className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Search for a city to see the weather forecast.
              </Typography>
            </Paper>
          )
        )}

        {/* Error Snackbar */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%', borderRadius: 3 }}>
            {error}
          </Alert>
        </Snackbar>

      </Container>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .bg-clear-light { background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); }
        .bg-clear-dark { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); }
        .bg-clouds-light { background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%); }
        .bg-clouds-dark { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
        .bg-rain { background: linear-gradient(135deg, #334155 0%, #475569 100%); }
        .bg-snow { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
        .bg-thunder { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); }
      `}} />
    </Box>
  );
}
