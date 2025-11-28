export interface AvatarProfile {
  baseModel: string;
  materials: {
    skinColor: string;
    hairColor: string;
    outfitPreset: string;
  };
}

export interface AvatarCustomization {
  skinColor: string;
  hairColor: string;
  outfitPreset: string;
}
