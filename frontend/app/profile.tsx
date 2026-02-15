import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const userId = 1; // สมมุติว่า login แล้วได้ user_id

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://<your-backend>/users/${userId}`);
        if (!res.ok) throw new Error('ไม่พบข้อมูล');
        const data = await res.json();
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setGender(data.gender || '');
        setBirthdate(data.birthdate || '');
        setProfileImage(data.image_url || null);
      } catch {
        // ถ้า error ให้แสดงค่าว่างไว้
        setFirstName('');
        setLastName('');
        setGender('');
        setBirthdate('');
        setProfileImage(null);
      }
    };

    fetchProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      await fetch(`http://<your-backend>/users/${userId}/upload-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch {
      Alert.alert('อัปโหลดรูปภาพไม่สำเร็จ');
    }
  };

  const handleSave = async () => {
    const payload = {
      first_name: firstName,
      last_name: lastName,
      gender,
      birthdate,
    };

    try {
      await fetch(`http://<your-backend>/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      Alert.alert('บันทึกโปรไฟล์สำเร็จ');
    } catch {
      Alert.alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleDelete = async () => {
    Alert.alert('ยืนยันการลบ', 'คุณแน่ใจหรือไม่ว่าต้องการลบโปรไฟล์นี้?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`http://<your-backend>/users/${userId}`, {
              method: 'DELETE',
            });
            Alert.alert('ลบโปรไฟล์แล้ว');
            // TODO: redirect หรือ logout
          } catch {
            Alert.alert('เกิดข้อผิดพลาดในการลบ');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>โปรไฟล์ของคุณ</Text>

      <TouchableOpacity onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>เลือกรูปโปรไฟล์</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="ชื่อ"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="นามสกุล"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="เพศ"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="วันเกิด (2000-12-30)"
        value={birthdate}
        onChangeText={setBirthdate}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>บันทึก</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FF3B30', marginTop: 10 }]}
        onPress={handleDelete}
      >
        <Text style={styles.buttonText}>ลบโปรไฟล์</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
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
