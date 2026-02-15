import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from '../src/config/axiosInstance';

export default function RegisterScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !birthdate ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Error', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('gender', gender);
      formData.append('birthdate', birthdate);
      formData.append('email', email);
      formData.append('password', password);

      if (profileImage) {
        formData.append('image', {
          uri: profileImage,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await axios.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('สำเร็จ', 'สมัครสมาชิกสำเร็จ', [
        { text: 'ไปหน้าล็อกอิน', onPress: () => router.replace('/login') },
      ]);
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
      Alert.alert('ผิดพลาด', 'สมัครสมาชิกไม่สำเร็จ');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>สมัครสมาชิก</Text>

      <TouchableOpacity onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>เลือกรูปโปรไฟล์</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="ชื่อ" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="นามสกุล" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="เพศ (Male/Female)" value={gender} onChangeText={setGender} />
      <TextInput style={styles.input} placeholder="วันเกิด (2000-12-30)" value={birthdate} onChangeText={setBirthdate} />
      <TextInput style={styles.input} placeholder="อีเมล" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="รหัสผ่าน" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="ยืนยันรหัสผ่าน" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>สมัครสมาชิก</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.registerText}>มีบัญชีอยู่แล้วเข้า ล็อกอิน</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  registerText: { color: '#2196F3', textAlign: 'center', marginTop: 15 },
  image: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 20 },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
