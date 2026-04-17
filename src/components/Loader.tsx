import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = "Loading weather data..." }: LoaderProps) {
  return (
    <Box 
      className="glass-card"
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "300px",
        p: 4 
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 3, fontWeight: 500, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );
}
