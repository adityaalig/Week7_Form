import { useState } from 'react';
import { 
  View, Text, TouchableOpacity, Image, Alert, StyleSheet, 
  KeyboardAvoidingView, ScrollView, Platform,
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFormik } from 'formik';
import { FormInput } from '../components/FormInput';
import { RegisterSchema } from '../utils/validationSchemas';

export default function RegisterScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Izinkan akses galeri untuk memilih foto.'); return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const showOptions = () => Alert.alert('Foto Profil', 'Pilih sumber foto', [
    { text: 'Kamera', onPress: takePhoto },
    { text: 'Galeri', onPress: pickImage },
    { text: 'Batal', style: 'cancel' },
  ]);

  const formik = useFormik({
    initialValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!profileImage) {
        Alert.alert('Perhatian', 'Mohon pilih foto profil terlebih dahulu.');
        setSubmitting(false); return;
      }
      try {
        await new Promise(r => setTimeout(r, 1500)); 
        
        // MODIFIKASI: Alert berhasil dihapus, langsung pindah ke Home.
        // Kita menggunakan 'replace' agar user tidak bisa menekan tombol 
        // "Back" di HP mereka untuk kembali ke form register ini.
        navigation.replace('Home');

      } catch (error) {
        Alert.alert('Error', 'Terjadi kesalahan saat mendaftar.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          
          <View style={styles.card}>
            <Text style={styles.title}>Buat Akun Baru</Text>
            <Text style={styles.subtitle}>Lengkapi data diri Anda di bawah ini</Text>

            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={showOptions}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatar} />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>+ Pilih Foto</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <FormInput label="Nama Lengkap" placeholder="Masukkan nama Anda" autoCapitalize="words" returnKeyType="next" value={formik.values.name} onChangeText={formik.handleChange('name')} onBlur={formik.handleBlur('name')} error={formik.errors.name} touched={formik.touched.name} />
            <FormInput label="Email" placeholder="contoh@email.com" keyboardType="email-address" autoCapitalize="none" returnKeyType="next" value={formik.values.email} onChangeText={formik.handleChange('email')} onBlur={formik.handleBlur('email')} error={formik.errors.email} touched={formik.touched.email} />
            <FormInput label="Nomor HP" placeholder="08123456789" keyboardType="phone-pad" returnKeyType="next" value={formik.values.phone} onChangeText={formik.handleChange('phone')} onBlur={formik.handleBlur('phone')} error={formik.errors.phone} touched={formik.touched.phone} />
            <FormInput label="Password" placeholder="Minimal 8 karakter" secureTextEntry returnKeyType="next" value={formik.values.password} onChangeText={formik.handleChange('password')} onBlur={formik.handleBlur('password')} error={formik.errors.password} touched={formik.touched.password} />
            <FormInput label="Konfirmasi Password" placeholder="Ulangi password" secureTextEntry returnKeyType="done" onSubmitEditing={formik.handleSubmit} value={formik.values.confirmPassword} onChangeText={formik.handleChange('confirmPassword')} onBlur={formik.handleBlur('confirmPassword')} error={formik.errors.confirmPassword} touched={formik.touched.confirmPassword} />

            <TouchableOpacity style={[styles.btn, formik.isSubmitting && styles.btnDisabled]} onPress={formik.handleSubmit} disabled={formik.isSubmitting}>
              <Text style={styles.btnText}>{formik.isSubmitting ? 'Memproses...' : 'Daftar Sekarang'}</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.footerLink}>Login di sini</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContainer: { flexGrow: 1, padding: 20, paddingBottom: 40, paddingTop: 30 },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },

  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  placeholder: { 
    width: 90, height: 90, borderRadius: 45, 
    backgroundColor: '#F9FAFB', 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed' 
  },
  placeholderIcon: { fontSize: 24 },
  placeholderText: { color: '#6B7280', fontSize: 12, marginTop: 4 },

  btn: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  footer: { marginTop: 24, flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: '#6B7280', fontSize: 14 },
  footerLink: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 }
});