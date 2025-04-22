import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
      },
  		screens: {
  			"xs": "475px",
  			"sm": "640px",
  			"md": "768px",
  			"lg": "1024px",
  			"xl": "1280px",
  			"2xl": "1400px",
  		},
  	},
  	extend: {
  		colors: {
  			border: "hsl(var(--border))",
  			input: "hsl(var(--input))",
  			ring: "hsl(var(--ring))",
  			background: "hsl(var(--background))",
  			foreground: "hsl(var(--foreground))",
  			primary: {
  				DEFAULT: "hsl(var(--primary))",
  				foreground: "hsl(var(--primary-foreground))",
  				50: "#f0fdf6",
  				100: "#dcfce9",
  				200: "#bbf7d6",
  				300: "#86efb0",
  				400: "#4ade80",
  				500: "#22c55e",
  				600: "#16a34a",
  				700: "#15803d",
  				800: "#166534",
  				900: "#14532d",
  				950: "#052e16"
  			},
  			secondary: {
  				DEFAULT: "hsl(var(--secondary))",
  				foreground: "hsl(var(--secondary-foreground))",
  			},
  			destructive: {
  				DEFAULT: "hsl(var(--destructive))",
  				foreground: "hsl(var(--destructive-foreground))",
  			},
  			muted: {
  				DEFAULT: "hsl(var(--muted))",
  				foreground: "hsl(var(--muted-foreground))",
  			},
  			accent: {
  				DEFAULT: "hsl(var(--accent))",
  				foreground: "hsl(var(--accent-foreground))",
  				50: "#f0f9ff",
  				100: "#e0f2fe",
  				200: "#bae6fd",
  				300: "#7dd3fc",
  				400: "#38bdf8",
  				500: "#0ea5e9",
  				600: "#0284c7",
  				700: "#0369a1",
  				800: "#075985",
  				900: "#0c4a6e",
  				950: "#082f49"
  			},
  			popover: {
  				DEFAULT: "hsl(var(--popover))",
  				foreground: "hsl(var(--popover-foreground))",
  			},
  			card: {
  				DEFAULT: "hsl(var(--card))",
  				foreground: "hsl(var(--card-foreground))",
  			},
  			success: {
  				DEFAULT: "#10b981",
  				50: "#ecfdf5",
  				100: "#d1fae5",
  				200: "#a7f3d0",
  				300: "#6ee7b7",
  				400: "#34d399",
  				500: "#10b981",
  				600: "#059669",
  				700: "#047857",
  				800: "#065f46",
  				900: "#064e3b",
  				950: "#022c22",
  			},
  			warning: {
  				DEFAULT: "#f59e0b",
  				50: "#fffbeb",
  				100: "#fef3c7",
  				200: "#fde68a",
  				300: "#fcd34d",
  				400: "#fbbf24",
  				500: "#f59e0b",
  				600: "#d97706",
  				700: "#b45309",
  				800: "#92400e",
  				900: "#78350f",
  				950: "#451a03",
  			},
  			info: {
  				DEFAULT: "#0ea5e9",
  				50: "#f0f9ff",
  				100: "#e0f2fe",
  				200: "#bae6fd",
  				300: "#7dd3fc",
  				400: "#38bdf8",
  				500: "#0ea5e9",
  				600: "#0284c7",
  				700: "#0369a1",
  				800: "#075985",
  				900: "#0c4a6e",
  				950: "#082f49",
  			},
  		},
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 2px)",
  			sm: "calc(var(--radius) - 4px)"
  		},
  		fontFamily: {
  			sans: ["var(--font-sans)", ...fontFamily.sans],
  			heading: ["var(--font-heading)", ...fontFamily.sans],
  		},
  		keyframes: {
  			"accordion-down": {
  				from: {
  					height: "0"
  				},
  				to: {
  					height: "var(--radix-accordion-content-height)"
  				}
  			},
  			"accordion-up": {
  				from: {
  					height: "var(--radix-accordion-content-height)"
  				},
  				to: {
  					height: "0"
  				}
  			},
        "marquee": {
          "0%": { transform: "translateX(100vw)" },
          "100%": { transform: "translateX(-100%)" }
        },
        "slideUpDown": {
          "0%, 25%": { transform: "translateY(0)" },
          "33%, 58%": { transform: "translateY(-100%)" },
          "66%, 91%": { transform: "translateY(-200%)" },
          "100%": { transform: "translateY(-300%)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" }
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" }
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "slide-out-top": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" }
        }
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
        "marquee": "marquee 30s linear infinite",
        "slide-up-down": "slideUpDown 12s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-out-left": "slide-out-left 0.5s ease-out",
        "slide-in-bottom": "slide-in-bottom 0.5s ease-out",
        "slide-out-top": "slide-out-top 0.5s ease-out"
  		},
  		boxShadow: {
  			'fitness': '0 0 0 2px rgba(34, 197, 94, 0.25)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-fitness': 'linear-gradient(to right, #22c55e, #0ea5e9)',
        'pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
  		},
      fontVariants: {
        sans: fontFamily.sans.reduce(
          (acc, font) => ({
            ...acc,
            [font]: { raw: `style(font-family: ${font})` },
          }),
          {}
        ),
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      height: {
        'screen-small': '100vh',
        'screen-large': 'calc(var(--vh, 1vh) * 100)',
      },
      minHeight: {
        'screen-small': '100vh',
        'screen-large': 'calc(var(--vh, 1vh) * 100)',
      },
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addBase, theme }: any) {
      addBase({
        // Responsive typography
        'html': { fontSize: '14px' },
        '@screen sm': { 'html': { fontSize: '15px' } },
        '@screen lg': { 'html': { fontSize: '16px' } },
        
        // Mobile touch targets
        'button, .touch-target': { 
          minHeight: '44px', 
          minWidth: '44px',
        },
        
        // Improve mobile spacing
        '@screen xs': {
          '.mobile-spacing': { padding: theme('spacing.3') }
        },
        '@screen sm': {
          '.mobile-spacing': { padding: theme('spacing.4') }
        },
      });
    },
  ],
} satisfies Config;
export default config;
