import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e293b', // Slate 800 - Professional dark blue
      light: '#334155', // Slate 700
      dark: '#0f172a', // Slate 900
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b82f6', // Blue 500 - Professional blue
      light: '#60a5fa', // Blue 400
      dark: '#2563eb', // Blue 600
      contrastText: '#ffffff',
    },
    accent: {
      main: '#8b5cf6', // Violet 500 - Subtle accent
      light: '#a78bfa', // Violet 400
      dark: '#7c3aed', // Violet 600
    },
    success: {
      main: '#10b981', // Emerald 500
      light: '#34d399', // Emerald 400
      dark: '#059669', // Emerald 600
    },
    warning: {
      main: '#f59e0b', // Amber 500
      light: '#fbbf24', // Amber 400
      dark: '#d97706', // Amber 600
    },
    error: {
      main: '#ef4444', // Red 500
      light: '#f87171', // Red 400
      dark: '#dc2626', // Red 600
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
      glass: 'rgba(255, 255, 255, 0.7)',
      glassDark: 'rgba(30, 41, 59, 0.8)',
    },
    text: {
      primary: '#1e293b', // Slate 800
      secondary: '#64748b', // Slate 500
      disabled: '#94a3b8', // Slate 400
    },
    divider: 'rgba(148, 163, 184, 0.2)', // Slate 400 with transparency
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.025em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          },
        },
        outlined: {
          border: '2px solid',
          borderColor: 'rgba(30, 41, 59, 0.2)',
          color: '#1e293b',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            borderColor: '#1e293b',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        },
        text: {
          color: '#1e293b',
          '&:hover': {
            backgroundColor: 'rgba(30, 41, 59, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: 'rgba(59, 130, 246, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
            '&.Mui-focused': {
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#64748b',
            fontWeight: 500,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.05)',
    '0 2px 6px rgba(0, 0, 0, 0.08)',
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 8px 24px rgba(0, 0, 0, 0.12)',
    '0 16px 48px rgba(0, 0, 0, 0.15)',
    '0 32px 96px rgba(0, 0, 0, 0.18)',
    '0 64px 192px rgba(0, 0, 0, 0.2)',
    '0 128px 384px rgba(0, 0, 0, 0.25)',
    '0 256px 768px rgba(0, 0, 0, 0.3)',
    '0 512px 1536px rgba(0, 0, 0, 0.35)',
    '0 1024px 3072px rgba(0, 0, 0, 0.4)',
    '0 2048px 6144px rgba(0, 0, 0, 0.45)',
    '0 4096px 12288px rgba(0, 0, 0, 0.5)',
    '0 8192px 24576px rgba(0, 0, 0, 0.55)',
    '0 16384px 49152px rgba(0, 0, 0, 0.6)',
    '0 32768px 98304px rgba(0, 0, 0, 0.65)',
    '0 65536px 196608px rgba(0, 0, 0, 0.7)',
    '0 131072px 393216px rgba(0, 0, 0, 0.75)',
    '0 262144px 786432px rgba(0, 0, 0, 0.8)',
    '0 524288px 1572864px rgba(0, 0, 0, 0.85)',
    '0 1048576px 3145728px rgba(0, 0, 0, 0.9)',
    '0 2097152px 6291456px rgba(0, 0, 0, 0.95)',
    '0 4194304px 12582912px rgba(0, 0, 0, 1)',
    '0 8388608px 25165824px rgba(0, 0, 0, 1)',
    '0 16777216px 50331648px rgba(0, 0, 0, 1)',
    '0 33554432px 100663296px rgba(0, 0, 0, 1)',
    '0 67108864px 201326592px rgba(0, 0, 0, 1)',
  ],
});
