import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

const CustomDropdown = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('This Month');

  const options = ['This Week', 'This Month'];

  return (
    <View>
      {/* The Trigger Button (Matches your design) */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.dropdownText}>{selected} ⌄</Text>
      </TouchableOpacity>

      {/* The Menu Modal */}
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              {options.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.menuItem}
                  onPress={() => {
                    setSelected(option);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.menuText}>
                    {selected === option ? `✓  ${option}` : `    ${option}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Trigger Button Style
  dropdownButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 110,
    alignItems: 'center',
  },
  dropdownText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },

  // Modal / Menu Style
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80, // Adjust this based on your header height
    paddingRight: 100, // Adjust based on your "Export" button position
  },
  menuContainer: {
    backgroundColor: '#1E293B', // Matches the screenshot dark grey/navy
    borderRadius: 10,
    paddingVertical: 8,
    width: 150,
    // Shadow for elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default CustomDropdown;
