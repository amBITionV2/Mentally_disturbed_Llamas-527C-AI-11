import { Platform } from 'react-native';

// For local development with Expo
// The public folder is served at the root in web, but needs special handling for native
// export const MODEL_URL = Platform.select({
//   web: '/model.glb', // Web: direct path from public folder
//   default: 'http://localhost:8081/model.glb' // Native: Metro bundler serves from root
// });
// constants.ts
// ✅ Use a CDN model for now - you can change this later
export const MODEL_URL = 'https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/rpm_tex.glb';



export const MODEL_URL_HARRY='https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/joe__realistic_human_3d_model/scene.gltf';
export const MODEL_URL_ALEX='https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/cool_man/scene.gltf';
export const MODEL_URL_MAYA= "https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/vrc_kipfel_youth/scene.gltf";
export const MODEL_URL_LUNA= "https://github.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/blob/main/pubg_female_purple_set/scene.gltf"

export const MODEL_URL_KAI="https://github.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/blob/main/cool_man/scene.gltf"

export const VIEWER_URL = 'https://your-domain.com/viewer/viewer.html';

export const SKIN_TONES = ['#fdbcb4', '#f4a460', '#e8b4a8', '#d4a574'];
export const HAIR_COLORS = ['#f4d03f', '#d4a520', '#8b6914', '#2b1b0f'];
export const OUTFIT_PRESETS = [
  { name: 'Blue Jacket', id: 'jacket_blue' },
  { name: 'Red Dress', id: 'dress_red' },
  { name: 'Casual', id: 'casual' },
  { name: 'Formal', id: 'formal' },
];