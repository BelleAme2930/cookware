import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    100: '#f6d1d6',
                    200: '#f4b5c1',
                    300: '#f299ad',
                    400: '#f07f9b',
                    500: '#e4023b',
                    600: '#d00136',
                    700: '#c00031',
                    800: '#a70027',
                    900: '#8d0020',
                },
            },
            fontSize: {
                base: '0.875rem',
            },
        },
    },

    plugins: [forms],
};
