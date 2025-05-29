
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

// Define the themes
export const themes: Theme[] = [
  {
    name: 'Default Earthy',
    colors: {
      '--background': '150 11% 95%', // #F2F4F3
      '--foreground': '0 0% 3.9%',
      '--card': '0 0% 100%',
      '--card-foreground': '0 0% 3.9%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '0 0% 3.9%',
      '--primary': '167 14% 55%', // #7A9D96
      '--primary-foreground': '0 0% 3.9%',
      '--secondary': '167 10% 90%',
      '--secondary-foreground': '167 14% 25%',
      '--muted': '210 20% 94%',
      '--muted-foreground': '0 0% 45.1%',
      '--accent': '35 26% 61%', // #B0926A
      '--accent-foreground': '0 0% 3.9%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '150 10% 88%',
      '--input': '150 10% 88%',
      '--ring': '167 14% 55%',
      '--sidebar-background': '0 0% 100%',
      '--sidebar-foreground': '0 0% 20%',
    },
  },
  {
    name: 'Party Vibe',
    colors: {
      '--background': '49 100% 71%', // #FFE66D (Creamy Peach/Yellow)
      '--foreground': '0 0% 3.9%', // Dark text
      '--card': '49 100% 75%', // Lighter version of bg
      '--card-foreground': '0 0% 3.9%',
      '--popover': '49 100% 75%',
      '--popover-foreground': '0 0% 3.9%',
      '--primary': '19 100% 60%', // #FF6B35 (Sunset Orange)
      '--primary-foreground': '0 0% 100%', // White text
      '--secondary': '32 93% 54%', // #F7931E (Tropical Pink/Orange)
      '--secondary-foreground': '0 0% 100%', // White text
      '--muted': '49 80% 80%', // Lighter, less saturated bg
      '--muted-foreground': '0 0% 30%',
      '--accent': '25 100% 65%', // Bright accent
      '--accent-foreground': '0 0% 100%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '49 100% 65%', // Darker bg for border
      '--input': '49 100% 65%',
      '--ring': '19 100% 60%', // Primary
      '--sidebar-background': '49 100% 68%',
      '--sidebar-foreground': '0 0% 3.9%',
    },
  },
  {
    name: 'Creative UI',
    colors: {
      '--background': '0 0% 100%', // #FFFFFF (Pure White)
      '--foreground': '283 50% 20%', // Dark violet text
      '--card': '0 0% 98%',
      '--card-foreground': '283 50% 20%',
      '--popover': '0 0% 98%',
      '--popover-foreground': '283 50% 20%',
      '--primary': '283 89% 37%', // #7209B7 (Electric Violet)
      '--primary-foreground': '0 0% 100%', // White text
      '--secondary': '159 100% 51%', // #06FFA5 (Cyber Lime)
      '--secondary-foreground': '0 0% 3.9%', // Dark text
      '--muted': '0 0% 94%',
      '--muted-foreground': '0 0% 45.1%',
      '--accent': '159 100% 65%', // Lighter Cyber Lime
      '--accent-foreground': '0 0% 3.9%',
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
    name: 'Strong Grinder',
    colors: {
      '--background': '240 1% 56%', // #8E8E93 (Steel Gray)
      '--foreground': '0 0% 100%', // White text
      '--card': '240 1% 50%', // Darker bg
      '--card-foreground': '0 0% 100%',
      '--popover': '240 1% 50%',
      '--popover-foreground': '0 0% 100%',
      '--primary': '240 3% 11%', // #1C1C1E (Iron Black)
      '--primary-foreground': '0 0% 98%', // Light text
      '--secondary': '3 100% 59%', // #FF3B30 (Fire Red)
      '--secondary-foreground': '0 0% 100%', // White text
      '--muted': '240 1% 45%',
      '--muted-foreground': '0 0% 90%',
      '--accent': '3 100% 59%', // Fire Red as accent
      '--accent-foreground': '0 0% 100%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '240 1% 40%',
      '--input': '240 1% 40%',
      '--ring': '3 100% 59%', // Secondary as ring for visibility
      '--sidebar-background': '240 1% 45%',
      '--sidebar-foreground': '0 0% 100%',
    },
  },
  {
    name: 'Luxury',
    colors: {
      '--background': '240 100% 99%', // #F8F8FF (Pearl White)
      '--foreground': '210 100% 12%', // #001F3F (Deep Navy)
      '--card': '0 0% 100%',
      '--card-foreground': '210 100% 12%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '210 100% 12%',
      '--primary': '45 65% 52%', // #D4AF37 (Champagne Gold)
      '--primary-foreground': '210 100% 12%', // Deep Navy text on Gold
      '--secondary': '210 100% 12%', // #001F3F (Deep Navy)
      '--secondary-foreground': '0 0% 100%', // White text
      '--muted': '240 60% 96%',
      '--muted-foreground': '210 80% 30%',
      '--accent': '45 65% 60%', // Lighter Gold
      '--accent-foreground': '210 100% 12%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '45 30% 85%', // Light gold/beige border
      '--input': '45 30% 85%',
      '--ring': '45 65% 52%', // Primary
      '--sidebar-background': '240 30% 95%',
      '--sidebar-foreground': '210 100% 12%',
    },
  },
  {
    name: 'Conqueror',
    colors: {
      '--background': '40 6% 90%', // #E5E4E2 (Platinum)
      '--foreground': '0 0% 3.9%', // Dark text
      '--card': '40 6% 95%', // Lighter platinum
      '--card-foreground': '0 0% 3.9%',
      '--popover': '40 6% 95%',
      '--popover-foreground': '0 0% 3.9%',
      '--primary': '214 100% 50%', // #007AFF (Victory Blue)
      '--primary-foreground': '0 0% 100%', // White text
      '--secondary': '51 100% 50%', // #FFD700 (Champion Gold)
      '--secondary-foreground': '0 0% 3.9%', // Dark text
      '--muted': '40 5% 85%',
      '--muted-foreground': '0 0% 30%',
      '--accent': '51 100% 60%', // Lighter Gold
      '--accent-foreground': '0 0% 3.9%',
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
    name: 'Dark Artistic',
    colors: {
      '--background': '38 43% 94%', // #F6F1E8 (Warm Ivory)
      '--foreground': '240 3% 18%', // #2D2D30 (Midnight Charcoal)
      '--card': '38 43% 98%', // Lighter ivory
      '--card-foreground': '240 3% 18%',
      '--popover': '38 43% 98%',
      '--popover-foreground': '240 3% 18%',
      '--primary': '240 3% 18%', // #2D2D30 (Midnight Charcoal)
      '--primary-foreground': '0 0% 98%', // Light text
      '--secondary': '276 42% 73%', // #B19CD9 (Soft Amethyst)
      '--secondary-foreground': '0 0% 3.9%', // Dark text
      '--muted': '38 30% 90%',
      '--muted-foreground': '240 3% 30%',
      '--accent': '276 42% 65%', // Slightly darker Amethyst
      '--accent-foreground': '0 0% 3.9%',
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '38 20% 85%',
      '--input': '38 20% 85%',
      '--ring': '276 42% 73%', // Secondary as ring
      '--sidebar-background': '38 43% 92%',
      '--sidebar-foreground': '240 3% 18%',
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
    // For dark mode specific variables - this simple setup assumes themes handle their own light/dark
    // If a theme is inherently dark, its '--foreground' etc. will be light.
    // A more complex setup could toggle a .dark class and have separate dark variants in theme.colors
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
