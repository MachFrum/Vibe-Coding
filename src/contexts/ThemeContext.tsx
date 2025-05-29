
'use client';

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ColorValues {
  '--background': string;
  '--foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--popover': string;
  '--popover-foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string;
  '--accent-foreground': string;
  '--destructive': string;
  '--destructive-foreground': string;
  '--border': string;
  '--input': string;
  '--ring': string;
  '--sidebar-background': string;
  '--sidebar-foreground': string;
}

export interface Theme {
  name: string;
  colors: ColorValues;
}

// Helper function to determine foreground color based on background lightness
const getHighContrastForeground = (backgroundHslString: string): string => {
  const lightness = parseFloat(backgroundHslString.split(' ')[2].replace('%', ''));
  return lightness > 50 ? '0 0% 3.9%' : '0 0% 98%'; // dark text on light bg, light text on dark bg
};

// Define the themes
export const themes: Theme[] = [
  {
    name: 'Party Vibe (Modern)', // #FAFAFA, #FF5722, #E91E63
    colors: {
      '--background': '0 0% 98%', // Clean White
      '--foreground': getHighContrastForeground('0 0% 98%'),
      '--card': '0 0% 100%', // Pure white card
      '--card-foreground': getHighContrastForeground('0 0% 100%'),
      '--popover': '0 0% 100%',
      '--popover-foreground': getHighContrastForeground('0 0% 100%'),
      '--primary': '16 100% 56%', // Modern Coral
      '--primary-foreground': getHighContrastForeground('16 100% 56%'),
      '--secondary': '16 100% 70%', // Lighter coral for ShadCN secondary
      '--secondary-foreground': getHighContrastForeground('16 100% 70%'),
      '--muted': '0 0% 94%', // Light gray for muted
      '--muted-foreground': '0 0% 45.1%',
      '--accent': '340 82% 52%', // Vibrant Pink for Accent
      '--accent-foreground': getHighContrastForeground('340 82% 52%'),
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '0 0% 90%', // Light border derived from background
      '--input': '0 0% 90%',
      '--ring': '16 100% 56%', // Primary color for ring
      '--sidebar-background': '0 0% 97%',
      '--sidebar-foreground': getHighContrastForeground('0 0% 97%'),
    },
  },
  {
    name: 'Creative UI', // #FFFFFF, #7209B7, #06FFA5
    colors: {
      '--background': '0 0% 100%', // Pure White
      '--foreground': '283 50% 20%', // Dark violet text
      '--card': '0 0% 98%',
      '--card-foreground': '283 50% 20%',
      '--popover': '0 0% 98%',
      '--popover-foreground': '283 50% 20%',
      '--primary': '283 89% 37%', // Electric Violet
      '--primary-foreground': '0 0% 100%', // White text on violet
      '--secondary': '283 89% 50%', // Lighter violet
      '--secondary-foreground': '0 0% 100%',
      '--muted': '0 0% 94%',
      '--muted-foreground': '0 0% 45.1%',
      '--accent': '159 100% 51%', // Cyber Lime
      '--accent-foreground': '0 0% 3.9%', // Dark text on lime
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '0 0% 90%',
      '--input': '0 0% 90%',
      '--ring': '283 89% 37%', // Primary
      '--sidebar-background': '0 0% 97%',
      '--sidebar-foreground': '283 50% 20%',
    },
  },
  {
    name: 'Strong Grinder', // #8E8E93, #1C1C1E, #FF3B30
    colors: {
      '--background': '240 1% 56%', // Steel Gray
      '--foreground': '0 0% 98%', // White text
      '--card': '240 1% 50%', // Darker gray
      '--card-foreground': '0 0% 98%',
      '--popover': '240 1% 50%',
      '--popover-foreground': '0 0% 98%',
      '--primary': '240 3% 11%', // Iron Black
      '--primary-foreground': '0 0% 98%', // Light text on black
      '--secondary': '240 3% 25%', // Darker gray for ShadCN secondary
      '--secondary-foreground': '0 0% 98%',
      '--muted': '240 1% 45%',
      '--muted-foreground': '0 0% 80%',
      '--accent': '3 100% 59%', // Fire Red
      '--accent-foreground': '0 0% 98%', // White text on red
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '240 1% 40%',
      '--input': '240 1% 40%',
      '--ring': '3 100% 59%', // Accent as ring for visibility
      '--sidebar-background': '240 3% 15%', // Darker sidebar
      '--sidebar-foreground': '0 0% 98%',
    },
  },
  {
    name: 'Luxury', // #F8F8FF, #001F3F, #D4AF37
    colors: {
      '--background': '240 100% 99%', // Pearl White
      '--foreground': '210 100% 12%', // Deep Navy text
      '--card': '0 0% 100%', // White card
      '--card-foreground': '210 100% 12%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '210 100% 12%',
      '--primary': '210 100% 12%', // Deep Navy
      '--primary-foreground': '0 0% 98%', // White text on navy
      '--secondary': '210 100% 25%', // Lighter navy
      '--secondary-foreground': '0 0% 98%',
      '--muted': '240 60% 96%',
      '--muted-foreground': '210 80% 30%',
      '--accent': '45 65% 52%', // Champagne Gold
      '--accent-foreground': '210 100% 12%', // Deep Navy text on Gold
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '45 30% 85%', // Light gold/beige border
      '--input': '45 30% 85%',
      '--ring': '45 65% 52%', // Accent
      '--sidebar-background': '240 30% 95%',
      '--sidebar-foreground': '210 100% 12%',
    },
  },
  {
    name: 'Conqueror', // #E5E4E2, #007AFF, #FFD700
    colors: {
      '--background': '40 6% 90%', // Platinum
      '--foreground': '0 0% 3.9%', // Dark text
      '--card': '40 6% 95%', // Lighter platinum
      '--card-foreground': '0 0% 3.9%',
      '--popover': '40 6% 95%',
      '--popover-foreground': '0 0% 3.9%',
      '--primary': '214 100% 50%', // Victory Blue
      '--primary-foreground': '0 0% 100%', // White text on blue
      '--secondary': '214 100% 65%', // Lighter blue
      '--secondary-foreground': '0 0% 100%',
      '--muted': '40 5% 85%',
      '--muted-foreground': '0 0% 30%',
      '--accent': '51 100% 50%', // Champion Gold
      '--accent-foreground': '0 0% 3.9%', // Dark text on gold
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '40 6% 80%',
      '--input': '40 6% 80%',
      '--ring': '214 100% 50%', // Primary
      '--sidebar-background': '40 6% 88%',
      '--sidebar-foreground': '0 0% 3.9%',
    },
  },
  {
    name: 'Dark Artistic', // #2D2D30, #B19CD9, #F6F1E8
    colors: {
      '--background': '240 3% 18%', // Midnight Charcoal
      '--foreground': '38 43% 94%', // Warm Ivory text
      '--card': '240 3% 22%', // Slightly lighter charcoal
      '--card-foreground': '38 43% 94%',
      '--popover': '240 3% 22%',
      '--popover-foreground': '38 43% 94%',
      '--primary': '276 42% 73%', // Soft Amethyst (light primary on dark BG)
      '--primary-foreground': '240 3% 10%', // Very dark text on light amethyst
      '--secondary': '276 42% 60%', // Darker Amethyst for ShadCN secondary
      '--secondary-foreground': '0 0% 98%',
      '--muted': '240 3% 25%', // Darker muted
      '--muted-foreground': '240 10% 70%', // Lighter muted text
      '--accent': '38 43% 94%', // Warm Ivory (light accent)
      '--accent-foreground': '240 3% 10%', // Dark text on light accent
      '--destructive': '0 70% 50%', // Adjusted destructive for dark theme
      '--destructive-foreground': '0 0% 98%',
      '--border': '240 3% 28%', // Subtle border
      '--input': '240 3% 28%',
      '--ring': '276 42% 73%', // Primary
      '--sidebar-background': '240 3% 15%', // Even darker sidebar
      '--sidebar-foreground': '38 43% 94%',
    },
  },
  {
    name: 'Ocean Breeze', // #E0F7FA, #006064, #26C6DA
    colors: {
      '--background': '188 67% 93%', // Soft Aqua
      '--foreground': '183 100% 15%', // Dark teal text
      '--card': '188 67% 97%', // Lighter aqua
      '--card-foreground': '183 100% 15%',
      '--popover': '188 67% 97%',
      '--popover-foreground': '183 100% 15%',
      '--primary': '183 100% 20%', // Deep Teal
      '--primary-foreground': '0 0% 98%', // White text
      '--secondary': '183 100% 30%', // Lighter Deep Teal
      '--secondary-foreground': '0 0% 98%',
      '--muted': '188 50% 88%',
      '--muted-foreground': '183 70% 30%',
      '--accent': '187 69% 50%', // Bright Cyan
      '--accent-foreground': '183 100% 10%', // Very dark text
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '188 60% 85%',
      '--input': '188 60% 85%',
      '--ring': '183 100% 20%', // Primary
      '--sidebar-background': '188 67% 90%',
      '--sidebar-foreground': '183 100% 15%',
    },
  },
  {
    name: 'Forest Calm', // #F1F8E9, #2E7D32, #8BC34A
    colors: {
      '--background': '88 48% 95%', // Mint Cream
      '--foreground': '123 47% 20%', // Dark green text
      '--card': '88 48% 98%', // Lighter mint
      '--card-foreground': '123 47% 20%',
      '--popover': '88 48% 98%',
      '--popover-foreground': '123 47% 20%',
      '--primary': '123 47% 33%', // Forest Green
      '--primary-foreground': '0 0% 98%', // White text
      '--secondary': '123 47% 45%', // Lighter Forest Green
      '--secondary-foreground': '0 0% 98%',
      '--muted': '88 30% 90%',
      '--muted-foreground': '123 30% 35%',
      '--accent': '88 53% 53%', // Fresh Lime
      '--accent-foreground': '123 47% 15%', // Darker green text
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '88 40% 88%',
      '--input': '88 40% 88%',
      '--ring': '123 47% 33%', // Primary
      '--sidebar-background': '88 48% 92%',
      '--sidebar-foreground': '123 47% 20%',
    },
  },
  {
    name: 'Sunset Glow (Modern)', // #F8F9FA, #D84315, #FF6B6B
    colors: {
      '--background': '210 17% 98%', // Soft Gray White
      '--foreground': getHighContrastForeground('210 17% 98%'),
      '--card': '0 0% 100%', // Pure white card
      '--card-foreground': getHighContrastForeground('0 0% 100%'),
      '--popover': '0 0% 100%',
      '--popover-foreground': getHighContrastForeground('0 0% 100%'),
      '--primary': '14 80% 46%', // Refined Terracotta
      '--primary-foreground': getHighContrastForeground('14 80% 46%'),
      '--secondary': '14 80% 60%', // Lighter terracotta for ShadCN secondary
      '--secondary-foreground': getHighContrastForeground('14 80% 60%'),
      '--muted': '210 15% 94%', // Light gray for muted
      '--muted-foreground': '210 10% 45%',
      '--accent': '0 100% 71%', // Soft Salmon for Accent
      '--accent-foreground': getHighContrastForeground('0 100% 71%'),
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '210 15% 90%', // Light border derived from background
      '--input': '210 15% 90%',
      '--ring': '14 80% 46%', // Primary color for ring
      '--sidebar-background': '210 17% 95%',
      '--sidebar-foreground': getHighContrastForeground('210 17% 95%'),
    },
  },
];

interface ThemeContextType {
  theme: Theme;
  setThemeByName: (themeName: string) => void;
  cycleTheme: () => void;
  themeIndex: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  const applyTheme = useCallback((theme: Theme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([variable, value]) => {
      root.style.setProperty(variable, value);
    });
  }, []);

  useEffect(() => {
    const storedThemeName = localStorage.getItem('malitrack-theme');
    const initialThemeIndex = themes.findIndex(t => t.name === storedThemeName);
    const themeToApply = themes[initialThemeIndex !== -1 ? initialThemeIndex : 0];
    
    setCurrentThemeIndex(initialThemeIndex !== -1 ? initialThemeIndex : 0);
    applyTheme(themeToApply);
  }, [applyTheme]);

  const setThemeByName = (themeName: string) => {
    const themeIndex = themes.findIndex(t => t.name === themeName);
    if (themeIndex !== -1) {
      setCurrentThemeIndex(themeIndex);
      applyTheme(themes[themeIndex]);
      localStorage.setItem('malitrack-theme', themes[themeIndex].name);
    }
  };

  const cycleTheme = () => {
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    setCurrentThemeIndex(nextThemeIndex);
    applyTheme(themes[nextThemeIndex]);
    localStorage.setItem('malitrack-theme', themes[nextThemeIndex].name);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[currentThemeIndex], setThemeByName, cycleTheme, themeIndex: currentThemeIndex }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

