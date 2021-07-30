module.exports = {
  darkMode: false,
  theme: {
    extend: {
      gridTemplateColumns: {
        //   '18': 'repeat(18,minmax(0,1fr))',
      },
      gridColumnEnd: {
        //   '19': '19',
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: {
          900: "#F29479", // #F29479
        },
        secondary: {
          900: "#70E796", // #70E796
        },
        dark: {
          700: "#808289", // #646779
          900: "hsl(229, 8%, 41%)", // #606372
        },
        light: {
          900: "hsl(227, 24%, 81%)", // #C3C8DA
        },
        transparent: {
          900: "rgba(1,1,1,0)",
        },
      },
    },
  },
  variants: {},
  plugins: [
    function ({ addBase, theme }) {
      // this function essentially adds all the colors mentioned above as css variables in the code
      // which can be very helpful
      // https://gist.github.com/Merott/d2a19b32db07565e94f10d13d11a8574

      function extractColorVars(colorObj, colorGroup = "") {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === "string"
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    },
  ],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  },
};
