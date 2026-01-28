/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                background: '#1A1A1A',
                secondary: '#808080',
                action: '#FF5722',
                luxury: '#9B111E',
            },
            fontFamily: {
                sans: ['Inter', 'Manrope', 'sans-serif'],
            },
            cursor: {
                'none': 'none',
            }
        },
    },
    plugins: [],
}
