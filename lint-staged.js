// eslint-disable-next-line no-undef
module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "eslint .",
    //'react-scripts test --bail --watchAll=false --findRelatedTests --passWithNoTests',
    () => "tsc-files --noEmit",
  ],
  "./**/*.{js,jsx,ts,tsx,css,md,json}": ["prettier --write"],
};
