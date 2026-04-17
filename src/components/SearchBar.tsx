import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Tooltip, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, onLocationSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper
        className="glass-card"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: { xs: '100%', md: 500 },
          borderRadius: '30px !important',
          transition: 'transform 0.2s',
          '&:focus-within': {
            transform: 'scale(1.02)'
          }
        }}
      >
        <Tooltip title="Use current location">
          <IconButton 
            sx={{ p: '12px' }} 
            aria-label="menu" 
            onClick={onLocationSearch}
            disabled={isLoading}
            color="primary"
          >
            <MyLocationIcon />
          </IconButton>
        </Tooltip>
        
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '1.1rem' }}
          placeholder="Search for a city..."
          inputProps={{ 'aria-label': 'search city weather' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        
        <IconButton 
          type="submit" 
          sx={{ p: '12px' }} 
          aria-label="search"
          disabled={isLoading || !query.trim()}
          color="primary"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
