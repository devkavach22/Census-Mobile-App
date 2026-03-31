import { showMessage, MessageType } from 'react-native-flash-message';

export const showToast = (message: string, type: MessageType = 'default') => {
  showMessage({
    message: message,
    type: type,
    icon: 'default',
    // Global styling to match your dashboard theme
    style: {
      borderRadius: 12,
      backgroundColor: '#0F172A',
      padding: 15,
      borderWidth: 1,
      borderColor: '#334155',
    },
    titleStyle: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    duration: 3000,
  });
};
