export const AVATAR_MODELS: Record<number, string> = {
  1: 'https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/final_hope.glb', // EMY
  2: 'https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/3d_scan_man_1/scene.gltf', // ALEX
  3: 'https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/vrc_kipfel_youth/scene.gltf', // MAYA
  4: 'https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/cool_man/scene.gltf', // KAI
  5: 'https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/pubg_female_purple_set/scene.gltf', // LUNA
  6: 'https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/joe__realistic_human_3d_model/scene.gltf', // HARRY
  7:'https://raw.githubusercontent.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/main/white_lady/scene.gltf', //Emma
};
// https://github.com/amBITionV2/Mentally_disturbed_Llamas-527C-AI-11/blob/main/final_hope.glb
// Helper function to get model URL by avatar ID
export const getModelUrlById = (avatarId: number): string => {
  return AVATAR_MODELS[avatarId] || AVATAR_MODELS[1]; // Fallback to first model
};