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
import { FONTS } from '../theme/fonts';
import KeyboardWrapper from '../components/KeyboardWrapper';
import { setStorageData, STORAGE_KEYS } from '../utils/storage';
import { AuthContext } from '../../App';
import { showToast } from '../components/common/showToast';
import {
  LoginWithAadhaarApi,
  LoginWithPasswordApi,
  LoginWithSendOtpApi,
  LoginWithVerifyOtpApi,
} from '../store/slices/commonSlice';
import { useAppDispatch } from '../store/hooks';
import { showMessage } from 'react-native-flash-message';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

type OtpBoxProps = {
  otp: string[];
  setOtp: (val: string[]) => void;
  inputs: any;
  focusedIndex: number;
  setFocusedIndex: (i: number) => void;
  mobileRef: any;
};

const Login = () => {
  const { setUserDetails } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState('Enumerator');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const inputs = useRef<Array<TextInput | null>>([]);
  const mobileRef = useRef<TextInput | null>(null);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<any>(null);
  const [loginType, setLoginType] = useState('OTP');
  const dispatch = useAppDispatch();
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(60);
  const timerRef = useRef<any>(null);
  const { isLogin, userData } = useSelector((state: any) => state.common);

  const ROLE_MAP: any = {
    Enumerator: 'enumerator',
    'District Admin': 'district_admin',
    'Super Admin': 'national_admin',
  };

  useEffect(() => {
    if (isLogin) {
      const loginData = {
        name: userData.name,
        userId: userData.user_id,
        district: { name: userData?.district, id: userData?.district_id },
        state: { name: userData?.state, id: userData?.state_id },
        role: userData?.user_type,
        loginType: userData?.login_type,
        mobile: userData?.mobile,
        isLoggedIn: true,
      };
      setStorageData(STORAGE_KEYS.LOGIN_DATA, loginData);
      setUserDetails(loginData);
    }
  }, [isLogin]);

  useEffect(() => {
    if (mobile.length === 10 && loginType === 'OTP') {
      const delay = setTimeout(() => {
        handleSendOtp();
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [mobile, loginType]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  /* ---------------- ROLE ITEM ---------------- */
  const RoleItem = ({ title, subtitle, icon }: any) => {
    const selected = selectedRole === title;

    return (
      <TouchableOpacity
        disabled={showTimer}
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
  }: OtpBoxProps) => {
    const handleChange = (text: string, index: number) => {
      if (!/^[0-9]?$/.test(text)) return;

      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move forward
      if (text && index < otp.length - 1) {
        setTimeout(() => {
          inputs.current[index + 1]?.focus();
        }, 50);
      }

      // Auto verify when last filled
      if (index === otp.length - 1 && text) {
        setTimeout(() => {
          handleLogin(); // 🔥 auto submit
        }, 200);
      }
    };

    const handleKeyPress = (key: string, index: number) => {
      if (key === 'Backspace') {
        if (otp[index] === '' && index > 0) {
          setTimeout(() => {
            inputs.current[index - 1]?.focus();
          }, 50);
        }
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
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
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
    if (loginType === 'OTP') {
      if (otp.some(v => v === '')) {
        showToast('Please enter the complete OTP', 'danger');
        return;
      }
      const loginData = {
        mobile: mobile,
        otp: otp.join(''),
        user_type: ROLE_MAP[selectedRole],
      };
      await dispatch(LoginWithVerifyOtpApi(loginData));
    }

    if (loginType === 'PASSWORD') {
      if (!mobile || mobile.length !== 10) {
        showToast('Please enter a valid 10-digit mobile number', 'danger');
        return;
      }
      if (!password) {
        showToast('Please enter your password', 'danger');
        return;
      }
      const loginData = {
        mobile: mobile,
        password: password,
        user_type: ROLE_MAP[selectedRole],
      };
      await dispatch(LoginWithPasswordApi(loginData));
    }

    if (loginType === 'AADHAAR') {
      if (!mobile || mobile.length !== 10) {
        showToast('Please enter a valid 10-digit mobile number', 'danger');
        return;
      }
      if (!aadhaar || aadhaar.length !== 12) {
        showToast('Please enter a valid 12-digit Aadhaar number', 'danger');
        return;
      }
      const loginData = {
        mobile: mobile,
        aadhaar: aadhaar,
        user_type: ROLE_MAP[selectedRole],
      };
      await dispatch(LoginWithAadhaarApi(loginData));
    }
  };

  const handleSendOtp = async () => {
    try {
      if (mobile.length !== 10) {
        showMessage({
          message: 'Please enter a valid 10-digit mobile number',
          type: 'danger',
        });
        return;
      }

      const loginData = {
        mobile: mobile,
        user_type: ROLE_MAP[selectedRole],
      };

      console.log('Sending OTP...', loginData);

      const result = await dispatch(LoginWithSendOtpApi(loginData)).unwrap();

      console.log('OTP sent successfully:', result);

      if (result?.status === 'success') {
        setShowTimer(true);
        setTimer(60);

        // ✅ Clear old timer safely
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        // ✅ Start timer
        timerRef.current = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              timerRef.current = null; // important
              setShowTimer(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // ✅ Focus first OTP box
        setTimeout(() => {
          inputs.current[0]?.focus();
        }, 300);
      }
    } catch (error: any) {
      console.log('OTP Error:', error);

      showMessage({
        message: error?.message || 'Failed to send OTP',
        type: 'danger',
      });
    }
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
              disabled={showTimer}
              style={loginType === 'OTP' ? styles.activeTab : styles.tab}
              onPress={() => {
                setLoginType('OTP'), setMobile('');
              }}
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
              disabled={showTimer}
              style={loginType === 'PASSWORD' ? styles.activeTab : styles.tab}
              onPress={() => {
                setLoginType('PASSWORD'), setMobile('');
              }}
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
              disabled={showTimer}
              style={loginType === 'AADHAAR' ? styles.activeTab : styles.tab}
              onPress={() => {
                setLoginType('AADHAAR'), setMobile('');
              }}
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
            editable={!showTimer}
            onChangeText={text => setMobile(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
          />

          {/* OTP LOGIN */}
          {loginType === 'OTP' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={styles.label}>Enter OTP</Text>
                <OtpBox
                  otp={otp}
                  setOtp={setOtp}
                  inputs={inputs}
                  focusedIndex={focusedIndex}
                  setFocusedIndex={setFocusedIndex}
                  mobileRef={mobileRef}
                />
              </View>
              {showTimer ? (
                <Text
                  style={{ color: '#6B7280', fontSize: 14, paddingRight: 20 }}
                >
                  Resend in {timer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text
                    style={{ color: '#2563EB', fontSize: 14, paddingRight: 20 }}
                  >
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* PASSWORD LOGIN */}
          {loginType === 'PASSWORD' && (
            <>
              <Text style={styles.label}>Enter Password</Text>

              <TextInput
                value={password}
                placeholder="Enter password"
                secureTextEntry
                style={styles.input}
                onChangeText={text => setPassword(text)}
              />
            </>
          )}

          {/* AADHAAR LOGIN */}
          {loginType === 'AADHAAR' && (
            <>
              <Text style={styles.label}>Enter Aadhaar</Text>
              <TextInput
                value={aadhaar}
                onChangeText={text => setAadhaar(text)}
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

          <Text style={styles.forgot}>Forgot password?</Text>
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
    fontFamily: FONTS.Bold,
    marginLeft: 8,
  },

  forgot: {
    textAlign: 'center',
    marginTop: 18,
    color: '#2563EB',
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
});

export default Login;
