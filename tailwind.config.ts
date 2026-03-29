import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
			"./1774824061327627856.html"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'oswald': ['Oswald', 'sans-serif'],
				'rubik': ['Rubik', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'flash-in': {
					'0%': { opacity: '0', transform: 'scale(1.4) skewX(-5deg)' },
					'30%': { opacity: '1', transform: 'scale(1) skewX(0deg)' },
					'80%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'20%': { transform: 'translateX(-4px) rotate(-1deg)' },
					'40%': { transform: 'translateX(4px) rotate(1deg)' },
					'60%': { transform: 'translateX(-3px)' },
					'80%': { transform: 'translateX(3px)' }
				},
				'glitch': {
					'0%': { clipPath: 'inset(0 0 100% 0)', transform: 'translateX(0)' },
					'20%': { clipPath: 'inset(20% 0 60% 0)', transform: 'translateX(-4px)' },
					'40%': { clipPath: 'inset(50% 0 30% 0)', transform: 'translateX(4px)' },
					'60%': { clipPath: 'inset(10% 0 80% 0)', transform: 'translateX(-2px)' },
					'80%': { clipPath: 'inset(70% 0 10% 0)', transform: 'translateX(2px)' },
					'100%': { clipPath: 'inset(0 0 0% 0)', transform: 'translateX(0)' }
				},
				'pulse-ring': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(2)', opacity: '0' }
				},
				'scanline': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100vh)' }
				},
				'particle-float': {
					'0%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '1' },
					'100%': { transform: 'translateY(-60px) translateX(20px) scale(0)', opacity: '0' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(30px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'beat': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'flicker': {
					'0%, 100%': { opacity: '1' },
					'33%': { opacity: '0.8' },
					'66%': { opacity: '0.95' }
				},
				'text-reveal': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'flash-in': 'flash-in 1.2s ease-out forwards',
				'shake': 'shake 0.4s ease-in-out',
				'glitch': 'glitch 0.6s steps(1) infinite',
				'pulse-ring': 'pulse-ring 1s ease-out infinite',
				'scanline': 'scanline 3s linear infinite',
				'particle-float': 'particle-float 1s ease-out forwards',
				'slide-up': 'slide-up 0.5s ease-out forwards',
				'beat': 'beat 0.5s ease-in-out infinite',
				'flicker': 'flicker 2s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;