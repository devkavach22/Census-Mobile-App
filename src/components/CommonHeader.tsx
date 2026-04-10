import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../App';
import { removeStorageData, STORAGE_KEYS } from '../utils/storage';
import { updateState } from '../store/slices/commonSlice';
import { useAppDispatch } from '../store/hooks';

interface HeaderProps {
  name?: string;
  role?: string;
  address?: string;
  status?: string;
  routeName?: string;
}

const CommonHeader: React.FC<HeaderProps> = ({
  name = 'Ramesh Kumar',
  role = 'Enumerator',
  address = 'Ward 12, Saket, South Delhi',
  status = 'Online',
  routeName = '',
}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { userRole, setIsLoggedIn } = useContext(AuthContext);
  const ROLE_MAP: any = {
    ENUMERATOR: 'Enumerator',
    DISTRICT_ADMIN: 'District Admin',
    SUPER_ADMIN: 'Super Admin',
  };

  const ROUTE_MAP: any = {
    NationalDashboard: 'National Dashboard · Census HQ',
    StatePerformance: 'State Performance',
    DistrictPerformance: 'District Performance',
    FraudAnalytics: 'Fraud Analytics',
    Reports: 'Reports',
    UserManagement: 'User Management',
  };

  const logOut = async () => {
    // 1. Clear storage
    await removeStorageData(STORAGE_KEYS.LOGIN_DATA);

    // 2. Reset Redux state
    dispatch(
      updateState({
        isLogin: false,
        token: null,
        userData: null,
      }),
    );

    // 3. Reset context
    setIsLoggedIn(false);
  };

  const displayName =
    routeName === 'EnumeratorDashboard' || routeName === 'DistrictDashboard'
      ? `${name} - ${ROLE_MAP[userRole]}`
      : ROUTE_MAP[routeName];
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftContainer}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </View>

        {/* Name + Role */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{displayName}</Text>

          <Text style={styles.address}>{address}</Text>
        </View>
      </View>

      {/* Right Section */}
      <View style={styles.rightContainer}>
        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.statusText}>{status}</Text>
        </View>

        {/* Lock Icon */}
        <TouchableOpacity style={styles.lockButton} onPress={logOut}>
          <Text style={styles.lockIcon}>🔒</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: '#112D4E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  textContainer: {
    justifyContent: 'center',
  },

  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  address: {
    color: '#A9C3DC',
    fontSize: 12,
    marginTop: 2,
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E6F5C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },

  greenDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#00FF7F',
    marginRight: 5,
  },

  statusText: {
    color: '#D4F7E8',
    fontSize: 12,
    fontWeight: '500',
  },

  lockButton: {
    backgroundColor: '#1E3A5F',
    padding: 8,
    borderRadius: 8,
  },

  lockIcon: {
    fontSize: 16,
    color: '#fff',
  },
});
