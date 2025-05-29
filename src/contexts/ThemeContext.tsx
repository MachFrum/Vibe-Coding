
'use client';

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { hexToHsl } from '@/lib/colorUtils'; // Import hexToHsl

export interface ColorValues {
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
  const parts = backgroundHslString.match(/(\d+)\s*(\d+)%\s*(\d+)%/);
  if (!parts) return '0 0% 3.9%'; // Default to dark text
  const lightness = parseFloat(parts[3]);
  return lightness > 50 ? '0 0% 3.9%' : '0 0% 98%'; // dark text on light bg, light text on dark bg
};

const CUSTOM_COLOR_OVERRIDES_KEY = 'malitrack-custom-colors';

export const themes: Theme[] = [
  {
    name: 'Party Vibe (Modern)',
    colors: {
      '--background': '0 0% 98%', // Clean White #FAFAFA
      '--foreground': getHighContrastForeground('0 0% 98%'),
      '--card': '0 0% 100%', 
      '--card-foreground': getHighContrastForeground('0 0% 100%'),
      '--popover': '0 0% 100%',
      '--popover-foreground': getHighContrastForeground('0 0% 100%'),
      '--primary': '14 100% 56%', // Modern Coral #FF5722
      '--primary-foreground': getHighContrastForeground('14 100% 56%'),
      '--secondary': '339 82% 70%', // Lighter Vibrant Pink for ShadCN secondary from #E91E63
      '--secondary-foreground': getHighContrastForeground('339 82% 70%'),
      '--muted': '0 0% 94%', 
      '--muted-foreground': '0 0% 45.1%',
      '--accent': '339 82% 52%', // Vibrant Pink #E91E63 for Accent
      '--accent-foreground': getHighContrastForeground('339 82% 52%'),
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '0 0% 90%', 
      '--input': '0 0% 90%',
      '--ring': '14 100% 56%', 
      '--sidebar-background': '0 0% 97%',
      '--sidebar-foreground': getHighContrastForeground('0 0% 97%'),
    },
  },
  {
    name: 'Creative UI', 
    colors: {
      '--background': '0 0% 100%', // Pure White #FFFFFF
      '--foreground': hexToHsl('#2D004F')!, // Dark Violet text derived from Primary #7209B7
      '--card': '0 0% 98%',
      '--card-foreground': hexToHsl('#2D004F')!,
      '--popover': '0 0% 98%',
      '--popover-foreground': hexToHsl('#2D004F')!,
      '--primary': '283 89% 37%', // Electric Violet #7209B7
      '--primary-foreground': '0 0% 100%', 
      '--secondary': '283 89% 50%', 
      '--secondary-foreground': '0 0% 100%',
      '--muted': '0 0% 94%',
      '--muted-foreground': '0 0% 45.1%',
      '--accent': '159 100% 51%', // Cyber Lime #06FFA5
      '--accent-foreground': '0 0% 3.9%', 
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '0 0% 90%',
      '--input': '0 0% 90%',
      '--ring': '283 89% 37%', 
      '--sidebar-background': '0 0% 97%',
      '--sidebar-foreground': hexToHsl('#2D004F')!,
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
      '--secondary': '3 100% 70%', // Lighter Fire Red for ShadCN secondary from #FF3B30
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#FF3B30')!),
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
      '--secondary': '45 65% 65%', // Lighter Champagne Gold for ShadCN secondary from D4AF37
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#D4AF37')!),
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
      '--secondary': '51 100% 65%', // Lighter Champion Gold for ShadCN secondary from #FFD700
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#FFD700')!),
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
      '--background': '240 3% 18%', // Midnight Charcoal #2D2D30
      '--foreground': '38 43% 94%', // Warm Ivory #F6F1E8 text
      '--card': '240 3% 22%', 
      '--card-foreground': '38 43% 94%',
      '--popover': '240 3% 22%',
      '--popover-foreground': '38 43% 94%',
      '--primary': '276 42% 73%', // Soft Amethyst #B19CD9 (light primary on dark BG)
      '--primary-foreground': '240 3% 10%', 
      '--secondary': '38 43% 85%', // Lighter Warm Ivory for ShadCN secondary from #F6F1E8
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#F6F1E8')!),
      '--muted': '240 3% 25%', 
      '--muted-foreground': '240 10% 70%', 
      '--accent': '38 43% 94%', // Warm Ivory #F6F1E8 (light accent)
      '--accent-foreground': '240 3% 10%', 
      '--destructive': '0 70% 50%', 
      '--destructive-foreground': '0 0% 98%',
      '--border': '240 3% 28%', 
      '--input': '240 3% 28%',
      '--ring': '276 42% 73%', 
      '--sidebar-background': '240 3% 15%', 
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
      '--secondary': '187 69% 60%', // Lighter Bright Cyan for ShadCN secondary from #26C6DA
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#26C6DA')!),
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
      '--secondary': '88 53% 65%', // Lighter Fresh Lime for ShadCN secondary from #8BC34A
      '--secondary-foreground': getHighContrastForeground(hexToHsl('#8BC34A')!),
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
    name: 'Sunset Glow (Modern)',
    colors: {
      '--background': '210 17% 98%', // Soft Gray White #F8F9FA
      '--foreground': getHighContrastForeground('210 17% 98%'),
      '--card': '0 0% 100%', 
      '--card-foreground': getHighContrastForeground('0 0% 100%'),
      '--popover': '0 0% 100%',
      '--popover-foreground': getHighContrastForeground('0 0% 100%'),
      '--primary': '15 86% 46%', // Refined Terracotta #D84315
      '--primary-foreground': getHighContrastForeground('15 86% 46%'),
      '--secondary': '0 100% 80%', // Lighter Soft Salmon for ShadCN secondary from #FF6B6B
      '--secondary-foreground': getHighContrastForeground('0 100% 80%'),
      '--muted': '210 15% 94%', 
      '--muted-foreground': '210 10% 45%',
      '--accent': '0 100% 71%', // Soft Salmon #FF6B6B for Accent
      '--accent-foreground': getHighContrastForeground('0 100% 71%'),
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': '210 15% 90%', 
      '--input': '210 15% 90%',
      '--ring': '15 86% 46%', 
      '--sidebar-background': '210 17% 95%',
      '--sidebar-foreground': getHighContrastForeground('210 17% 95%'),
    },
  },
];

type CustomColorOverrides = Partial<Record<keyof ColorValues, string>>;

interface ThemeContextType {
  theme: Theme;
  setThemeByName: (themeName: string) => void;
  cycleTheme: () => void;
  themeIndex: number;
  customColorOverrides: CustomColorOverrides;
  updateCustomColor: (variableName: keyof ColorValues, hslValue: string) => void;
  getEffectiveColor: (variableName: keyof ColorValues) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [customColorOverrides, setCustomColorOverrides] = useState<CustomColorOverrides>({});

  const applyColors = useCallback((baseColors: ColorValues, overrides: CustomColorOverrides) => {
    const root = document.documentElement;
    const effectiveColors = { ...baseColors, ...overrides };
    Object.entries(effectiveColors).forEach(([variable, value]) => {
      root.style.setProperty(variable, value);
    });
  }, []);

  useEffect(() => {
    // Load stored theme
    const storedThemeName = localStorage.getItem('malitrack-theme');
    const initialThemeIndex = themes.findIndex(t => t.name === storedThemeName);
    const validInitialIndex = initialThemeIndex !== -1 ? initialThemeIndex : 0;
    setCurrentThemeIndex(validInitialIndex);

    // Load custom color overrides
    const storedOverrides = localStorage.getItem(CUSTOM_COLOR_OVERRIDES_KEY);
    const initialOverrides = storedOverrides ? JSON.parse(storedOverrides) : {};
    setCustomColorOverrides(initialOverrides);
    
    applyColors(themes[validInitialIndex].colors, initialOverrides);
  }, [applyColors]);

  const setThemeByName = (themeName: string) => {
    const themeIndex = themes.findIndex(t => t.name === themeName);
    if (themeIndex !== -1) {
      setCurrentThemeIndex(themeIndex);
      applyColors(themes[themeIndex].colors, customColorOverrides);
      localStorage.setItem('malitrack-theme', themes[themeIndex].name);
    }
  };

  const cycleTheme = () => {
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    setCurrentThemeIndex(nextThemeIndex);
    applyColors(themes[nextThemeIndex].colors, customColorOverrides);
    localStorage.setItem('malitrack-theme', themes[nextThemeIndex].name);
  };

  const updateCustomColor = (variableName: keyof ColorValues, hslValue: string) => {
    const newOverrides = { ...customColorOverrides, [variableName]: hslValue };
    setCustomColorOverrides(newOverrides);
    localStorage.setItem(CUSTOM_COLOR_OVERRIDES_KEY, JSON.stringify(newOverrides));
    applyColors(themes[currentThemeIndex].colors, newOverrides);
  };
  
  const getEffectiveColor = (variableName: keyof ColorValues): string => {
    return customColorOverrides[variableName] || themes[currentThemeIndex].colors[variableName];
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: themes[currentThemeIndex], 
      setThemeByName, 
      cycleTheme, 
      themeIndex: currentThemeIndex,
      customColorOverrides,
      updateCustomColor,
      getEffectiveColor
    }}>
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
