import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { FONTS } from '../theme/fonts';

const ForgotPasswordModal = ({
  visible,
  onClose,
  mobile,
  setMobile,
  onVerify,
  onBackToLogin,
}: any) => {
  const [error, setError] = useState('');

  const validateMobile = () => {
    const cleaned = mobile.replace(/\D/g, '');

    if (!cleaned) {
      setError('Mobile number is required');
      return false;
    }

    if (cleaned.length !== 10) {
      setError('Mobile number must be 10 digits');
      return false;
    }

    if (!/^[6-9]/.test(cleaned)) {
      setError('Enter valid mobile number');
      return false;
    }

    setError('');
    return true;
  };

  const handleVerify = () => {
    if (validateMobile()) {
      onVerify(cleanedMobile(mobile)); // optional formatted value
    }
  };

  const cleanedMobile = (num: string) => num.replace(/\D/g, '');

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.centeredView}
          >
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Forgot Password?</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.close}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Input */}
              <Text style={styles.label}>mobile number</Text>
              <TextInput
                style={[styles.input, error && { borderColor: 'red' }]}
                placeholder="+91 9XXXX XXXXX"
                keyboardType="phone-pad"
                value={mobile}
                maxLength={10}
                onChangeText={text => {
                  const cleaned = text.replace(/\D/g, '');
                  setMobile(cleaned);
                  setError('');
                }}
              />

              {/* Error */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Button */}
              <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
                <Text style={styles.verifyText}>Verify</Text>
              </TouchableOpacity>

              {/* Back */}
              <TouchableOpacity onPress={onBackToLogin}>
                <Text style={styles.backText}>back to login</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '36%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: FONTS.Bold,
  },

  close: {
    fontSize: 18,
    color: '#666',
  },

  label: {
    marginTop: 15,
    marginBottom: 6,
    color: '#666',
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f5f5f5',
    fontFamily: FONTS.SemiBold,
  },

  verifyBtn: {
    marginTop: 20,
    backgroundColor: '#3A63B8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.Bold,
  },

  backText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#3A63B8',
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    fontFamily: FONTS.SemiBold,
  },
});

export default ForgotPasswordModal;
