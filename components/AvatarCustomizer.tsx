import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import type { AvatarProfile } from '../types/profile';

const OUTFIT_PRESETS = [
  { name: 'Blue Jacket', id: 'jacket_blue' },
  { name: 'Red Dress', id: 'dress_red' },
  { name: 'Casual', id: 'casual' },
  { name: 'Formal', id: 'formal' },
];

interface AvatarCustomizerProps {
  profile: AvatarProfile;
  onUpdate: (updates: Partial<AvatarProfile>) => void | Promise<void>;
}

export default function AvatarCustomizer({
  profile,
  onUpdate,
}: AvatarCustomizerProps) {
  const [editing, setEditing] = useState(false);
  const [skinColor, setSkinColor] = useState(
    profile.materials.skinColor || '#E7C7A4'
  );
  const [hairColor, setHairColor] = useState(
    profile.materials.hairColor || '#2b1b0f'
  );
  const [outfitPreset, setOutfitPreset] = useState(
    profile.materials.outfitPreset || 'jacket_blue'
  );

  const handleSave = async () => {
    await onUpdate({
      materials: {
        skinColor,
        hairColor,
        outfitPreset,
      },
    });
    setEditing(false);
  };

  if (!editing) {
    return (
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setEditing(true)}
      >
        <Text style={styles.editButtonText}>✏️ Customize Avatar</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customize Avatar</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Skin Tone</Text>
        <View style={styles.colorInput}>
          <View
            style={[styles.colorPreview, { backgroundColor: skinColor }]}
          />
          <TextInput
            style={styles.hexInput}
            value={skinColor}
            onChangeText={setSkinColor}
            placeholder="#E7C7A4"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Hair Color</Text>
        <View style={styles.colorInput}>
          <View
            style={[styles.colorPreview, { backgroundColor: hairColor }]}
          />
          <TextInput
            style={styles.hexInput}
            value={hairColor}
            onChangeText={setHairColor}
            placeholder="#2b1b0f"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Outfit</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.presetList}
        >
          {OUTFIT_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.presetButton,
                outfitPreset === preset.id && styles.presetButtonActive,
              ]}
              onPress={() => setOutfitPreset(preset.id)}
            >
              <Text style={styles.presetButtonText}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>✓ Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => setEditing(false)}
        >
          <Text style={styles.buttonText}>✕ Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  colorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#555',
  },
  hexInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  presetList: {
    flexDirection: 'row',
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444',
  },
  presetButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  presetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#16a34a',
  },
  cancelButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});