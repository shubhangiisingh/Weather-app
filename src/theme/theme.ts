"use client";

import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#3b82f6',
          },
          background: {
            default: '#f5f7fa',
            paper: 'rgba(255, 255, 255, 0.7)',
          },
          text: {
            primary: '#1c1c1e',
            secondary: '#475569',
          },
        }
      : {
          primary: {
            main: '#60a5fa',
          },
          background: {
            default: '#0f172a',
            paper: 'rgba(30, 41, 59, 0.7)',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
          },
        }),
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 300,
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
