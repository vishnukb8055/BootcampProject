module.exports = {
    presets: [
      '@babel/preset-env',   // Transpile ES6+ syntax
      '@babel/preset-react'  // Handle React JSX syntax
    ],
    plugins: [
      '@babel/plugin-transform-runtime' // Optimize Babel helper code
    ]
  };