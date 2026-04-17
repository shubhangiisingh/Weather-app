import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { ForecastData } from '../services/weatherService';

interface ForecastProps {
  data: ForecastData[];
}

export default function Forecast({ data }: ForecastProps) {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        5-Day Forecast
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          overflowX: 'auto',
          pb: 2, // padding for scrollbar
          '::-webkit-scrollbar': { height: '8px' },
          '::-webkit-scrollbar-thumb': { backgroundColor: 'primary.main', borderRadius: '4px' }
        }}
      >
        {data.map((day, index) => {
          const dateObj = new Date(day.date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
          
          return (
            <Card 
              key={index} 
              className="glass-card"
              sx={{ 
                minWidth: 140,
                flexShrink: 0,
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                  {index === 0 ? 'Today' : dayName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Typography>
                
                <Box 
                  component="img" 
                  src={iconUrl} 
                  alt={day.condition}
                  sx={{ width: 60, height: 60, my: 1 }}
                />
                
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                  {day.temperature}°C
                </Typography>
                <Typography variant="body2" sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>
                  {day.condition}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
