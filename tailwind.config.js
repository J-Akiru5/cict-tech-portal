import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Primary - Maroon
                maroon: {
                    50: '#fdf2f4',
                    100: '#fce4e8',
                    200: '#facdd5',
                    300: '#f6a5b4',
                    400: '#ef718a',
                    500: '#e54565',
                    600: '#d0244c',
                    700: '#7f1d1d',
                    800: '#5c1515',
                    900: '#3b0d0d',
                    950: '#240707',
                },
                // Accent - Gold
                gold: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#d4a017',
                    600: '#b8860b',
                    700: '#92400e',
                    800: '#783c0a',
                    900: '#451a03',
                    950: '#2a0f01',
                },
            },
            backdropBlur: {
                xs: '2px',
                '2xl': '40px',
                '3xl': '64px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'gradient': 'gradient 8s ease infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(180, 134, 11, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(180, 134, 11, 0.6)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(127, 29, 29, 0.15)',
                'glass-lg': '0 24px 48px 0 rgba(127, 29, 29, 0.20)',
                'glow-gold': '0 0 30px rgba(212, 160, 23, 0.4)',
                'glow-maroon': '0 0 30px rgba(127, 29, 29, 0.4)',
            },
        },
    },

    plugins: [forms],
};
