import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlashSleep</Text>
      <Image
        source={require('../assets/images/logo_flashsleep.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.buttonWrapper}>
        <View style={styles.buttonContainer}>
          <Button title="เข้าสู่ระบบ" onPress={() => router.replace('/login')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="สมัครสมาชิก" onPress={() => router.push('/register')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});
