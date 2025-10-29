/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // Safelist custom 'ink' utilities to ensure they are generated when using @apply
    // This helps in some dev environments where the config isn't picked up immediately
    safelist: [
        { pattern: /^bg-ink-(?:300|400|500|600|700|800|900)$/ },
        { pattern: /^border-ink-(?:300|400|500|600|700)$/ },
        { pattern: /^text-ink-(?:300|400|500|600|700)$/ },
        { pattern: /^hover:bg-ink-(?:300|400|500|600|700)$/ }
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#7C3AED', // primary
                    600: '#6D28D9', // hover
                    700: '#5B21B6',
                    800: '#4C1D95',
                    900: '#3A1166'
                },
                ink: {
                    100: '#D1D1D1',
                    200: '#A3A3A3',
                    300: '#757575',
                    400: '#474747',
                    500: '#1A1A1A',
                    600: '#141414',
                    700: '#0F0F0F',
                    800: '#0A0A0A',
                    900: '#050505'
                }
            }
        },
    },
    plugins: [],
}