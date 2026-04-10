import { showMessage, MessageType } from 'react-native-flash-message';
import { COLORS } from '../../theme/colors';

export const showToast = (message: string, type: MessageType = 'default') => {
  showMessage({
    message: message,
    type: type,
    icon: 'default',
    style: {
      borderRadius: 12,
      backgroundColor: type === 'success' ? COLORS.PRIMERY : COLORS.Red,
      padding: 15,
      bottom: 30,
      borderWidth: 1,
      borderColor: type === 'success' ? '#334155' : COLORS.Red,
    },
    titleStyle: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    duration: 3000,
  });
};
