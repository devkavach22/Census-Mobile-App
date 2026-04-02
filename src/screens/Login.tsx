import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../components/common/AppIcon';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { FONTS } from '../theme/fonts';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { setStorageData, STORAGE_KEYS } from '../utils/storage';
import { AuthContext } from '../../App';
import { showToast } from '../components/common/showToast';

const { width } = Dimensions.get('window');

type OtpBoxProps = {
  otp: string[];
  setOtp: (val: string[]) => void;
  inputs: React.MutableRefObject<Array<TextInput | null>>;
  focusedIndex: number;
  setFocusedIndex: (i: number) => void;
  mobileRef: React.MutableRefObject<TextInput | null>;
};

const Login = () => {
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState('Enumerator');
  const [mobile, setMobile] = useState('');

  const inputs = useRef<Array<TextInput | null>>([]);
  const mobileRef = useRef<TextInput | null>(null);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<any>(null);
  const [loginType, setLoginType] = useState('OTP');

  const ROLE_MAP: any = {
    Enumerator: 'ENUMERATOR',

    'District Admin': 'DISTRICT_ADMIN',

    'Super Admin': 'SUPER_ADMIN',
  };

  /* ✅ OTP FOCUS FIX */
  useEffect(() => {
    const started = otp.some(v => v !== '');

    if (started) {
      mobileRef.current?.blur();

      requestAnimationFrame(() => {
        inputs.current[focusedIndex]?.focus();
      });
    }
  }, [otp, focusedIndex]);

  /* ---------------- ROLE ITEM ---------------- */
  const RoleItem = ({ title, subtitle, icon }: any) => {
    const selected = selectedRole === title;

    return (
      <TouchableOpacity
        style={[styles.roleCard, selected && styles.roleSelected]}
        onPress={() => setSelectedRole(title)}
      >
        <View style={styles.roleRow}>
          <AppIcon type="Feather" name={icon} size={22} color="#CFE3FF" />

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.roleTitle}>{title}</Text>
            <Text style={styles.roleSubtitle}>{subtitle}</Text>
          </View>

          {selected && (
            <AppIcon type="Feather" name="check" size={22} color="#4DA3FF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  /* ---------------- OTP BOX ---------------- */
  const OtpBox = ({
    otp,
    setOtp,
    inputs,
    focusedIndex,
    setFocusedIndex,
    mobileRef,
  }: OtpBoxProps) => {
    const handleChange = (text: string, index: number) => {
      if (!/^[0-9]?$/.test(text)) return;

      mobileRef.current?.blur();

      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < otp.length - 1) {
        const next = index + 1;
        setFocusedIndex(next);

        requestAnimationFrame(() => {
          inputs.current[next]?.focus();
        });
      }
    };

    const handleKeyPress = (key: string, index: number) => {
      if (key === 'Backspace' && !otp[index] && index > 0) {
        const prev = index - 1;
        setFocusedIndex(prev);

        requestAnimationFrame(() => {
          inputs.current[prev]?.focus();
        });
      }
    };

    return (
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref: any) => (inputs.current[index] = ref)}
            style={[
              styles.otpBox,
              focusedIndex === index && styles.otpBoxFocused,
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            textAlign="center"
            blurOnSubmit={false}
            onFocus={() => setFocusedIndex(index)}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
          />
        ))}
      </View>
    );
  };

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async () => {
    const systemRole = ROLE_MAP[selectedRole];

    const loginData = {
      mobile,
      role: systemRole,
      loginType,
      isLoggedIn: true,
    };

    /* ✅ SAVE LOGIN DATA */

    await setStorageData(STORAGE_KEYS.LOGIN_DATA, loginData);
    showToast('Login successful!, Redirecting...');
    setUserRole(systemRole);

    setTimeout(() => {
      setIsLoggedIn(true);
    }, 1500);
  };

  return (
    <KeyboardWrapper>
      <SafeAreaView style={styles.container}>
        {/* LEFT PANEL */}
        <View style={styles.leftPanel}>
          <View style={{ marginTop: 20 }}>
            <View style={styles.logoCircle}>
              <AppIcon name="account-balance" size={28} color="#FFF" />
            </View>

            <Text style={styles.govTitle}>Government of India</Text>
            <Text style={styles.govSub}>Census & Survey Platform</Text>

            <Text style={styles.roleHeading}>SELECT YOUR ROLE</Text>

            <RoleItem
              title="Enumerator"
              subtitle="Field Data Collection"
              icon="user"
            />
            <RoleItem
              title="District Admin"
              subtitle="Admin Dashboard"
              icon="home"
            />
            <RoleItem
              title="Super Admin"
              subtitle="State / National"
              icon="globe"
            />
          </View>

          <Text style={styles.footerText}>
            🔒 MeitY Certified · SSL Secured
          </Text>
        </View>

        {/* RIGHT PANEL */}
        <View style={styles.rightPanel}>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.signIn}>Sign in as {selectedRole}</Text>

          <View style={styles.tabRow}>
            {/* OTP TAB */}
            <TouchableOpacity
              style={loginType === 'OTP' ? styles.activeTab : styles.tab}
              onPress={() => setLoginType('OTP')}
            >
              <AppIcon type="Feather" name="smartphone" size={18} />
              <Text
                style={
                  loginType === 'OTP' ? styles.activeTabText : styles.tabText
                }
              >
                OTP Login
              </Text>
            </TouchableOpacity>

            {/* PASSWORD TAB */}
            <TouchableOpacity
              style={loginType === 'PASSWORD' ? styles.activeTab : styles.tab}
              onPress={() => setLoginType('PASSWORD')}
            >
              <AppIcon type="Feather" name="key" size={18} />
              <Text
                style={
                  loginType === 'PASSWORD'
                    ? styles.activeTabText
                    : styles.tabText
                }
              >
                Password
              </Text>
            </TouchableOpacity>

            {/* AADHAAR TAB */}
            <TouchableOpacity
              style={loginType === 'AADHAAR' ? styles.activeTab : styles.tab}
              onPress={() => setLoginType('AADHAAR')}
            >
              <AppIcon name="badge" size={18} color="#7B3FE4" />
              <Text
                style={
                  loginType === 'AADHAAR'
                    ? styles.activeTabText
                    : styles.tabText
                }
              >
                Aadhaar
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Mobile Number</Text>

          <TextInput
            ref={mobileRef}
            placeholder="+91 9XXXXXXXXX"
            value={mobile}
            onChangeText={text => setMobile(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
          />

          {/* OTP LOGIN */}
          {loginType === 'OTP' && (
            <>
              <Text style={styles.label}>Enter OTP</Text>

              <OtpBox
                otp={otp}
                setOtp={setOtp}
                inputs={inputs}
                focusedIndex={focusedIndex}
                setFocusedIndex={setFocusedIndex}
                mobileRef={mobileRef}
              />
            </>
          )}

          {/* PASSWORD LOGIN */}
          {loginType === 'PASSWORD' && (
            <>
              <Text style={styles.label}>Enter Password</Text>

              <TextInput
                placeholder="Enter password"
                secureTextEntry
                style={styles.input}
              />
            </>
          )}

          {/* AADHAAR LOGIN */}
          {loginType === 'AADHAAR' && (
            <>
              <Text style={styles.label}>Enter Aadhaar</Text>

              <TextInput
                placeholder="XXXX XXXX XXXX"
                keyboardType="number-pad"
                maxLength={12}
                style={styles.input}
              />
            </>
          )}

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <AppIcon type="Feather" name="lock" size={18} color="#FFF" />
            <Text style={styles.loginText}> Secure Login</Text>
          </TouchableOpacity>

          <Text style={styles.forgot}>Forgot password / User ID?</Text>
        </View>
      </SafeAreaView>
    </KeyboardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0B1F36',
  },

  leftPanel: {
    width: width * 0.32,
    backgroundColor: '#102A43',
    padding: 30,
    justifyContent: 'space-between',
  },

  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E4FA3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },

  /* LEFT PANEL TEXT */

  govTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    alignSelf: 'center',
  },

  govSub: {
    color: '#B6C2CF',
    fontSize: 13,
    fontFamily: FONTS.Regular,
    marginBottom: 28,
    alignSelf: 'center',
  },

  roleHeading: {
    color: '#9FB3C8',
    fontSize: 12,
    fontFamily: FONTS.Medium,
    marginBottom: 12,
    letterSpacing: 1,
  },

  roleCard: {
    backgroundColor: '#1B3A5B',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  roleSelected: {
    borderWidth: 2,
    borderColor: '#4DA3FF',
  },

  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  roleTitle: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: FONTS.SemiBold,
  },

  roleSubtitle: {
    color: '#C0CAD8',
    fontSize: 13,
    maxWidth: 200,
    fontFamily: FONTS.Regular,
  },

  footerText: {
    color: '#8FA6C1',
    fontSize: 12,
    fontFamily: FONTS.Regular,
  },

  /* RIGHT PANEL */

  rightPanel: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 40,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },

  welcome: {
    fontSize: 30,
    fontFamily: FONTS.Bold,
    color: '#111827',
  },

  signIn: {
    color: '#6B7280',
    fontSize: 15,
    fontFamily: FONTS.Regular,
    marginBottom: 25,
  },

  /* TABS */

  tabRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },

  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
  },

  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
    elevation: 2,
  },

  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: FONTS.Medium,
  },

  activeTabText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },

  /* INPUT */

  label: {
    marginBottom: 8,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: '#374151',
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    backgroundColor: '#FFF',
    fontSize: 15,
    fontFamily: FONTS.Regular,
    color: '#111827',
  },

  /* OTP */

  otpContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  otpBox: {
    width: 48,
    height: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#FFF',
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },

  otpBoxFocused: {
    borderColor: '#244E9B',
    borderWidth: 2,
    backgroundColor: '#F0F6FF',
  },

  /* BUTTON */

  loginBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#244E9B',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
  },

  loginText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    marginLeft: 8,
  },

  forgot: {
    textAlign: 'center',
    marginTop: 18,
    color: '#2563EB',
    fontSize: 14,
    fontFamily: FONTS.Medium,
  },
});

export default Login;
