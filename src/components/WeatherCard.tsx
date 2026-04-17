import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { WeatherData } from '../services/weatherService';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';

interface WeatherCardProps {
  data: WeatherData;
}

export default function WeatherCard({ data }: WeatherCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

  return (
    <Card 
      className="glass-card" 
      sx={{ 
        overflow: 'visible',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.15) !important'
        }
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
          <Box sx={{ flex: 1, width: '100%' }}>
            <Typography variant="h3" component="h2" gutterBottom>
              {data.city}, <Typography variant="h4" component="span" color="text.secondary">{data.country}</Typography>
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Typography variant="h1" component="div" sx={{ fontWeight: 700, mr: 2 }}>
                {data.temperature}°C
              </Typography>
            </Box>
            
            <Typography variant="h5" sx={{ textTransform: 'capitalize', color: 'text.secondary', fontWeight: 500 }}>
              {data.description}
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
              <Box 
                component="img" 
                src={iconUrl} 
                alt={data.condition}
                sx={{ 
                  width: 150, 
                  height: 150,
                  filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))',
                  animation: 'float 3s ease-in-out infinite'
                }} 
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2, maxWidth: 300, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '120px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WaterDropIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Humidity</Typography>
                      <Typography variant="h6">{data.humidity}%</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1, minWidth: '120px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AirIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Wind</Typography>
                      <Typography variant="h6">{(data.windSpeed * 3.6).toFixed(1)} km/h</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </Card>
  );
}
