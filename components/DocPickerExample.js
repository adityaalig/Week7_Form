import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { Button } from 'react-native';

export function DocPickerExample() {
  const [file, setFile] = useState(null);

  const pickDoc = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        const picked = result.assets[0];
        setFile({
          name: picked.name,
          size: (picked.size / 1024).toFixed(1) + ' KB',
          type: picked.mimeType,
          uri: picked.uri,
        });
        console.log('File dipilih:', picked.name);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <Button title="Pilih Dokumen" onPress={pickDoc} />;
}