import { View, Text, TouchableOpacity, StyleSheet,
         KeyboardAvoidingView, ScrollView, Platform, Alert, 
         TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useFormik } from 'formik';
import { FormInput } from '../components/FormInput';
import { LoginSchema } from '../utils/validationSchemas';

export default function LoginScreen({ navigation }) {
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await new Promise(r => setTimeout(r, 1500)); 
        
        if (values.email === 'admin@test.com') {
          navigation.replace('HomeScreen');
        } else {
          setFieldError('email', 'Email atau password salah');
        }
        
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.screen}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          <View style={styles.card}>
            <Text style={styles.title}>Selamat Datang</Text>
            <Text style={styles.subtitle}>Silakan login ke akun Anda</Text>

            <FormInput
              label="Email"
              placeholder="contoh@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              error={formik.errors.email}
              touched={formik.touched.email}
            />
            
            <FormInput
              label="Password"
              placeholder="Masukkan password"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={formik.handleSubmit}
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              error={formik.errors.password}
              touched={formik.touched.password}
            />

            <TouchableOpacity
              style={[styles.btn, formik.isSubmitting && styles.btnDisabled]}
              onPress={formik.handleSubmit}
              disabled={formik.isSubmitting}
            >
              <Text style={styles.btnText}>
                {formik.isSubmitting ? 'Memproses...' : 'Masuk'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Daftar Sekarang</Text>
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
  scrollContainer: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  
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

  btn: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  footer: { marginTop: 24, flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: '#6B7280', fontSize: 14 },
  footerLink: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 }
});