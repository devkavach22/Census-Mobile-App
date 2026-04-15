import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AppIcon from './common/AppIcon';
import { FONTS } from '../theme/fonts';
import { useAppDispatch } from '../store/hooks';
import { ResetPasswordApi } from '../store/slices/commonSlice';

const ConfromForgotPasswordModal = ({
  visible,
  forgotMobile,
  setForgotMobile,
  onClose,
}: any) => {
  const [tempPassword, setTempPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showTemp, setShowTemp] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const dispatch = useAppDispatch();
  const validate = () => {
    let err: any = {};
    if (!tempPassword.trim()) {
      err.tempPassword = 'Temporary password is required';
    }

    if (!password.trim()) {
      err.password = 'Password is required';
    } else if (password.length < 6) {
      err.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      err.password = 'Must include 1 uppercase & 1 number';
    }

    if (!confirmPassword.trim()) {
      err.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      err.confirmPassword = 'Passwords do not match';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const resetPasswordConfrim = async (value: any) => {
    const payload = { mobile: forgotMobile, ...value };
    const result: any = await dispatch(ResetPasswordApi(payload));
    if (result.payload.status === 'success') {
      onClose();
      setForgotMobile('');
      setForgotMobile('');
      setTempPassword('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setForgotMobile('');
      onClose();
    }
  };

  const handleReset = () => {
    if (!validate()) return;

    const payload = {
      temp_password: tempPassword,
      new_password: password,
    };

    resetPasswordConfrim(payload);
  };

  const renderInput = (
    label: any,
    value: any,
    setValue: any,
    show: any,
    setShow: any,
    placeholder: any,
    error: any,
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputBox, error && { borderColor: 'red' }]}>
        <TextInput
          placeholder={placeholder}
          secureTextEntry={!show}
          value={value}
          maxLength={20}
          onChangeText={setValue}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setShow(!show)}>
          <AppIcon
            type="Ionicons"
            name={show ? 'eye-off' : 'eye'}
            size={18}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
          >
            <View style={styles.modalBox}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Forgot Password?</Text>
                <TouchableOpacity onPress={onClose}>
                  <AppIcon name="close" size={20} />
                </TouchableOpacity>
              </View>

              {/* Inputs */}
              {renderInput(
                'Temporary password',
                tempPassword,
                setTempPassword,
                showTemp,
                setShowTemp,
                'Enter Your Temporary Password',
                errors.tempPassword,
              )}

              {renderInput(
                'Password',
                password,
                setPassword,
                showPass,
                setShowPass,
                'Enter Your Password',
                errors.password,
              )}

              {renderInput(
                'Confirm password',
                confirmPassword,
                setConfirmPassword,
                showConfirm,
                setShowConfirm,
                'Re-Type Your Password',
                errors.confirmPassword,
              )}

              {/* Button */}
              <TouchableOpacity
                style={[styles.button]}
                // disabled={!isFormValid()}
                onPress={handleReset}
              >
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>

              {/* Back */}
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.back}>back to login</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfromForgotPasswordModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '36%',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONTS.Bold,
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    color: '#444',
    fontSize: 13,
    fontFamily: FONTS.SemiBold,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    fontFamily: FONTS.Regular,
  },
  button: {
    backgroundColor: '#2b5db6',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: FONTS.SemiBold,
  },
  back: {
    textAlign: 'center',
    color: '#2b5db6',
    marginTop: 12,
    fontFamily: FONTS.SemiBold,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
    marginTop: 2,
  },
});
