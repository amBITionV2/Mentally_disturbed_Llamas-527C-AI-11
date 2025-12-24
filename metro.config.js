const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add GLB/GLTF support
config.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg');

module.exports = config;