import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';
import { COLORS } from '../theme/colors';

const CommonLoader = ({
  visible = false,
  text = 'Please wait...',
  fullScreen = true,
  color = COLORS.PRIMERY,
  transparent = true,
}) => {
  if (!visible) return null;

  if (fullScreen) {
    return (
      <Modal transparent={transparent} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size="small" color={color} />
      {text && <Text style={styles.inlineText}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    minWidth: 120,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default CommonLoader;
