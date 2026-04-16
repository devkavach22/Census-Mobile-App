import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  TextInput,
} from 'react-native';
import AppIcon from '../../components/common/AppIcon';
import {
  getStorageData,
  removeStorageData,
  STORAGE_KEYS,
} from '../../utils/storage';
import { AuthContext } from '../../../App';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS } from '../../theme/fonts';
import { showToast } from '../../components/common/showToast';
import {
  DashboardStatesApi,
  GetNotificationsApi,
  updateState,
} from '../../store/slices/commonSlice';
import { useAppDispatch } from '../../store/hooks';
import { USER_ROLE_API_MAP } from '../../utils/common';
import { useSelector } from 'react-redux';
const { width } = Dimensions.get('window');
const isTablet = width >= 600;
const getNotificationConfig = (type: any) => {
  switch (type) {
    case 'warning':
      return { icon: 'warning', color: '#F59E0B' };
    case 'failed':
      return { icon: 'x-circle', color: '#EF4444', type: 'Feather' };
    case 'success':
      return { icon: 'check-circle', color: '#16A34A', type: 'Feather' };
    case 'information':
      return { icon: 'info', color: '#3B82F6' };
    default:
      return { icon: 'bell', color: '#6B7280' };
  }
};
const EnumeratorDashboard = () => {
  const Navigation = useNavigation();
  const IsFocused = useIsFocused();
  const [householdData, setHouseholdData] = useState(null);
  const { userDetails, setUserDetails } = useContext(AuthContext);
  const { DashboardStatesData, notifications } = useSelector(
    (state: any) => state.common,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (IsFocused) {
      dispatch(DashboardStatesApi());
      dispatch(GetNotificationsApi());

      loadHouseholdData();
    }
  }, [IsFocused]);

  const loadHouseholdData = async () => {
    try {
      const result = await getStorageData(STORAGE_KEYS.HOUSE_HOLD_DATA);
      setHouseholdData(result);
    } catch (error) {
      console.log('Storage error:', error);
    }
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
    setUserDetails(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="default" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View style={styles.userRow}>
            {/* Avatar */}

            <View style={styles.avatar}>
              <AppIcon type="Material" name="person" size={28} color="#fff" />
            </View>

            <View>
              <Text style={styles.userName}>{`${userDetails.name} - ${
                USER_ROLE_API_MAP[userDetails.role]
              }`}</Text>

              <Text style={styles.userLocation}>
                {`${userDetails.district.name},${userDetails.state.name}`}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            {/* Online Badge */}

            <View style={styles.onlineBadge}>
              <View style={styles.dot} />
              <Text style={styles.onlinehHeaderText}>Online</Text>
            </View>

            {/* Lock Icon */}

            <TouchableOpacity style={styles.lockIcon} onPress={logOut}>
              <AppIcon type="Feather" name="lock" size={18} color="#CBD5F5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= STATS ================= */}

        <View style={styles.statsRow}>
          <StatCard
            title="ASSIGNED"
            value={DashboardStatesData?.assigned}
            subtitle="Households"
            color="#0F172A"
          />

          <StatCard
            title="COMPLETED"
            value={DashboardStatesData?.completed}
            subtitle="Surveys done"
            color="#16A34A"
          />

          <StatCard
            title="PENDING"
            value={DashboardStatesData?.pending}
            subtitle="Remaining"
            color="#F59E0B"
          />

          <StatCard
            title="FLAGGED"
            value={DashboardStatesData?.flagged}
            subtitle="Review needed"
            color="#EF4444"
          />
        </View>

        {/* ================= PROGRESS ================= */}

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>

            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>8 of 12 done today</Text>
            </View>
          </View>

          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.progressTarget}>Target: 12/day</Text>

            <Text style={styles.progressPercent}>66% complete</Text>
          </View>
        </View>

        {/* ================= MAIN GRID ================= */}

        <View style={styles.mainRow}>
          {/* QUICK ACTIONS */}

          <View style={styles.quickActionsCard}>
            <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>

            <View style={styles.quickGrid}>
              <QuickAction
                title="Add Household"
                icon="home"
                navigateTo="AddHousehold"
                householdData={householdData}
              />

              <QuickAction
                title="Continue Survey"
                icon="play-circle"
                type="Feather"
                navigateTo="Survey"
                householdData={householdData}
              />

              <QuickAction
                title="Map View"
                icon="map"
                type="Feather"
                navigateTo="MapView"
                householdData={householdData}
              />

              <QuickAction
                title="My Reports"
                icon="file-text"
                type="Feather"
                householdData={householdData}
              />
            </View>
          </View>

          {/* NOTIFICATIONS */}

          <View style={styles.notificationsCard}>
            <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {notifications.map((item: any, index: any) => {
                const config = getNotificationConfig(item.type);

                return (
                  <React.Fragment key={index}>
                    <NotificationItem
                      icon={config.icon}
                      type={config.type}
                      color={config.color}
                      title={item.message}
                      subtitle={item.time}
                    />

                    {index !== notifications.length - 1 && (
                      <View style={styles.notificationSeparator} />
                    )}
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* ================= AI ASSISTANT ================= */}

        <View style={styles.aiCard}>
          {/* Header */}
          <View style={styles.aiHeader}>
            <View style={styles.aiTitleRow}>
              <AppIcon type="Feather" name="cpu" size={18} color="#2563EB" />

              <Text style={styles.sectionTitle}>AI SUPPORT ASSISTANT</Text>
            </View>

            <View style={styles.onlineBadgeSmall}>
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>

          {/* First AI Message */}
          <View style={styles.aiMessage}>
            <Text style={styles.aiMessageText}>
              Hello Ramesh! You have 2 pending verifications. Need help with
              Aadhaar mismatch cases?
            </Text>
          </View>

          {/* Input Row */}
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Ask anything... (Hindi/English)"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />

            <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          {/* Second AI Message */}
          <View style={styles.aiMessageSecondary}>
            <AppIcon
              type="Feather"
              name="cpu"
              size={16}
              color="#6B7280"
              style={{ marginRight: 6 }}
            />

            <Text style={styles.secondaryMessageText}>
              Duplicate household alerts can be dismissed if you verify a
              different address in person.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EnumeratorDashboard;

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, subtitle, color }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>

    <Text style={[styles.statValue, { color }]}>{value}</Text>

    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </View>
);

const QuickAction = ({
  title,
  icon,
  type = 'Material',
  navigateTo,
  householdData,
}: any) => {
  const Navigation = useNavigation();

  const handlePress = () => {
    if (!navigateTo) {
      showToast('Reports feature coming soon');
      return;
    }

    // Example condition logic
    if (title === 'Continue Survey' && !householdData) {
      showToast('No saved household data found');
      return;
    }

    Navigation.navigate(navigateTo as never);
  };

  return (
    <TouchableOpacity style={styles.quickCard} onPress={handlePress}>
      <View style={styles.quickIcon}>
        <AppIcon type={type} name={icon} size={22} color="#2563EB" />
      </View>

      <Text style={styles.quickText}>{title}</Text>
    </TouchableOpacity>
  );
};

const NotificationItem = ({
  title,
  subtitle,
  icon,
  color,
  type = 'Material',
}: any) => (
  <View style={styles.notificationItem}>
    <View style={styles.notificationIcon}>
      <AppIcon type={type} name={icon} size={18} color={color} />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.notificationTitle}>{title}</Text>

      <Text style={styles.notificationSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E8F0',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    margin: 16,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  userName: {
    color: 'white',
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
  },

  notificationSeparator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },

  userLocation: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: FONTS.Regular,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },

  onlinehHeaderText: {
    color: 'white',
    fontSize: 12,
    fontFamily: FONTS.Medium,
  },

  onlineText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '600',
  },

  lockIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },

  progressTarget: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: FONTS.Medium,
  },

  progressPercent: {
    color: '#2563EB',
    fontSize: 13,
    fontFamily: FONTS.Bold,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
  },

  statTitle: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: FONTS.Medium,
  },

  statValue: {
    fontSize: 26,
    marginTop: 4,
    fontFamily: FONTS.Bold,
  },

  statSubtitle: {
    color: '#475569',
    fontSize: 13,
    fontFamily: FONTS.Regular,
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressTitle: {
    fontSize: 15,
    fontFamily: FONTS.SemiBold,
  },

  progressBadge: {
    backgroundColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  progressBadgeText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontFamily: FONTS.Medium,
  },

  progressBarBackground: {
    height: 8,
    backgroundColor: '#CBD5F5',
    borderRadius: 6,
    marginTop: 12,
  },

  progressBarFill: {
    width: '66%',
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 6,
  },

  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  mainRow: {
    flexDirection: isTablet ? 'row' : 'column',
    marginHorizontal: 16,
  },

  quickActionsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 8,
  },

  notificationsCard: {
    flex: 1,
    maxHeight: 300,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 10,
    color: '#6B7280',
    marginLeft: 6,
    fontFamily: FONTS.SemiBold,
    letterSpacing: 0.5,
  },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  quickCard: {
    width: '48%',
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },

  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  quickText: {
    fontSize: 13,
    fontFamily: FONTS.Medium,
  },

  notificationItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  notificationTitle: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
  },

  notificationSubtitle: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: FONTS.Regular,
  },

  aiCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    margin: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  onlineBadgeSmall: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },

  aiMessage: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  sendButton: {
    marginLeft: 8,
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },

  aiMessageText: {
    color: '#1E3A8A',
    fontSize: 13,
    fontFamily: FONTS.Regular,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  aiMessageSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  secondaryMessageText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
});
