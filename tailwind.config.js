/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './index.tsx', './App.tsx', './src/**/*.{ts,tsx}'],
  safelist: ['via-cyber-pink', 'via-cyber-cyan', 'via-cyber-yellow'],
  theme: {
    extend: {
      colors: {
        'cyber-cyan': '#00f0ff',
        'cyber-violet': '#b026ff',
        'cyber-pink': '#ff0096',
        'cyber-yellow': '#fcee0a',
        'cyber-acid': '#b0ff1a',
        'cyber-red': '#ff003c',
        'cyber-black': '#050505',
        'cyber-dark-metal': '#0a0a12',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-pink': '0 0 10px rgba(255, 0, 150, 0.5), 0 0 20px rgba(255, 0, 150, 0.3)',
        'neon-yellow': '0 0 10px rgba(252, 238, 10, 0.5), 0 0 20px rgba(252, 238, 10, 0.3)',
        'neon-acid': '0 0 10px rgba(176, 255, 26, 0.5), 0 0 20px rgba(176, 255, 26, 0.3)',
        'neon-red': '0 0 10px rgba(255, 0, 60, 0.5), 0 0 20px rgba(255, 0, 60, 0.3)',
        'neon-violet': '0 0 10px rgba(176, 38, 255, 0.5), 0 0 20px rgba(176, 38, 255, 0.3)',
        'console-glow': '0 -10px 40px rgba(0, 240, 255, 0.15)',
      },
      dropShadow: {
        'glow-cyan': '0 0 5px rgba(0, 240, 255, 0.8)',
        'glow-pink': '0 0 5px rgba(255, 0, 150, 0.8)',
        'glow-yellow': '0 0 5px rgba(252, 238, 10, 0.8)',
      },
      animation: {
        'hologram-flicker': 'hologram-flicker 4s infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-beam': 'scan-beam 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        glitch: 'glitch 3s infinite',
        'power-flow': 'power-flow 2s linear infinite',
        recoil: 'recoil 0.3s ease-out forwards',
        'grid-scroll': 'grid-scroll 20s linear infinite',
      },
      keyframes: {
        'hologram-flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.5' },
          '94%': { opacity: '1' },
          '98%': { opacity: '1' },
          '99%': { opacity: '0.7' },
        },
        'scan-beam': {
          '0%': { top: '-10%', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { top: '110%', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glitch: {
          '0%': { textShadow: '2px 2px 0px #ff003c, -2px -2px 0px #00f0ff' },
          '2%': { textShadow: '-2px 2px 0px #ff003c, 2px -2px 0px #00f0ff' },
          '4%': { textShadow: '2px -2px 0px #ff003c, -2px 2px 0px #00f0ff' },
          '6%': { textShadow: 'none' },
          '100%': { textShadow: 'none' },
        },
        'power-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        recoil: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '20%': { transform: 'translateY(10px) scale(0.98)' },
          '50%': { transform: 'translateY(-5px) scale(1.02)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        'grid-scroll': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '50px 50px' },
        },
      },
    },
  },
  plugins: [],
};
