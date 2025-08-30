// /frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores base do ClickUp
        'clickup-bg': '#F5F8FC', // Fundo principal claro
        'clickup-card': '#FFFFFF', // Fundo do card do formulário
        'clickup-text-dark': '#1C1C1E', // Texto principal escuro
        'clickup-text-muted': '#6B7280', // Texto secundário/placeholder
        'clickup-border': '#D1D5DB', // Bordas de inputs e elementos

        // Cores da marca ClickUp (azuis e roxos)
        'clickup-purple': '#7B68EE', // Purple principal
        'clickup-blue': '#4F46E5',   // Blue principal
        'clickup-hover-purple': '#6A5ACD', // Purple de hover
        'clickup-hover-blue': '#4338CA',   // Blue de hover

        // Gradientes (para botões e background, se replicarmos o wavy background)
        'clickup-gradient-start': '#A855F7', // Roxo mais claro (para gradiente)
        'clickup-gradient-end': '#EC4899',   // Rosa (para gradiente)

        // Outras cores de feedback
        'clickup-success': '#10B981', // Verde
        'clickup-error': '#EF4444',   // Vermelho
      },
      animation: {
        'scale-in': 'scale-in 0.2s ease-out', // Nossa nova animação
      },
      keyframes: {
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      fontFamily: {
        // Fontes inspiradas no ClickUp (Roboto é uma boa alternativa comum)
        // O ClickUp usa "Inter" ou "Roboto Flex". Vamos usar "Inter" para simplicidade
        // ou você pode importar uma fonte do Google Fonts se quiser uma réplica exata.
        sans: ['Inter', 'sans-serif'], 
      },
      boxShadow: {
        // Sombras para o card principal, inspiradas no ClickUp
        'clickup-card-shadow': '0px 10px 30px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        // Este é para replicar o gradiente de fundo "wavy"
        'clickup-wave': 'linear-gradient(to right bottom, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}