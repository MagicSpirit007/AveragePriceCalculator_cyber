import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.averagepricecalculator.app',
  appName: 'AveragePriceCalculator',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
