module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      [ // Add this array structure if it's not already there
        'babel-preset-expo', 
        {
          // Add this line
          unstable_transformImportMeta: true 
        }
      ]
    ],
  };
};

