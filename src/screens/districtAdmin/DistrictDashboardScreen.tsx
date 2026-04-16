import React, { useContext, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import AppIcon from '../../components/common/AppIcon';
import { AuthContext } from '../../../App';
import { removeStorageData, STORAGE_KEYS } from '../../utils/storage';
import CustomDropdown from '../../components/common/CustomDropdown';
import { showToast } from '../../components/common/showToast';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  GetDistrictDashboardApi,
  updateState,
} from '../../store/slices/commonSlice';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';

const DistrictDashboardScreen = () => {
  const { setUserDetails } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const masterAnim = useRef(new Animated.Value(0)).current;

  const { DistrictDashboardData } = useSelector((state: any) => state.common);

  /* ---------------- API CALL ---------------- */
  useEffect(() => {
    if (isFocused) {
      dispatch(GetDistrictDashboardApi());
    }
  }, [isFocused]);

  /* ---------------- ANIMATION ---------------- */
  useEffect(() => {
    Animated.timing(masterAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const logOut = async () => {
    await removeStorageData(STORAGE_KEYS.LOGIN_DATA);

    dispatch(
      updateState({
        isLogin: false,
        token: null,
        userData: null,
      }),
    );

    setUserDetails(null);
  };

  /* ---------------- SAFE DATA ---------------- */
  const dashboard = DistrictDashboardData || {};

  const stats = dashboard?.stats || {};
  const charts = dashboard?.charts || {};
  const heatmap = dashboard?.heatmap || {};

  /* ---------------- HEADER ---------------- */
  const districtName = dashboard?.district_name || 'District';
  const adminName = dashboard?.admin_name || 'Admin';

  /* ---------------- BAR CHART ---------------- */
  const barData = useMemo(() => {
    const colors = ['#3B82F6', '#60A5FA', '#2563EB', '#93C5FD'];

    return (charts?.population_by_ward || [])
      .slice(0, 8)
      .map((item: any, index: number) => ({
        value: Number(item?.value || 0),
        label:
          item?.name?.length > 8
            ? item?.name?.substring(0, 8)
            : item?.name || '',
        frontColor: colors[index % colors.length],
      }));
  }, [charts]);

  /* ---------------- PIE CHART ---------------- */
  const pieData = useMemo(() => {
    const colors: any = {
      Male: '#3B82F6',
      Female: '#C084FC',
      Other: '#CBD5E1',
    };

    return (charts?.gender_distribution || []).map((item: any) => ({
      value: Number(item?.percentage || 0),
      color: colors[item?.label] || '#94A3B8',
      text: `${item?.percentage}%`,
    }));
  }, [charts]);

  const centerPercent = charts?.gender_distribution?.[0]?.percentage || 0;

  /* ---------------- EMPLOYMENT ---------------- */
  const employmentColors = [
    '#1D4ED8',
    '#2563EB',
    '#D97706',
    '#DC2626',
    '#059669',
  ];

  /* ---------------- HEATMAP ---------------- */
  const heatmapRows = useMemo(() => {
    const list = heatmap?.ward_completion_stats || [];

    const getColor = (percent: number) => {
      if (percent >= 90) return '#1E3A8A';
      if (percent >= 70) return '#3B82F6';
      if (percent >= 50) return '#10B981';
      if (percent >= 30) return '#F59E0B';
      if (percent > 0) return '#EF4444';
      return '#E2E8F0';
    };

    const colors = list.map((item: any) =>
      getColor(Number(item?.completion_percent || 0)),
    );

    return [
      colors.filter((_: any, i: number) => i % 2 === 0),
      colors.filter((_: any, i: number) => i % 2 !== 0),
    ];
  }, [heatmap]);

  const renderEmploymentRow = (
    label: string,
    percentage: number,
    color: string,
  ) => (
    <View style={styles.employmentRow}>
      <Text style={styles.rowLabel}>{label}</Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <Text style={styles.rowPercent}>{percentage}%</Text>
    </View>
  );

  const renderGenderLegend = (label: string, value: number, color: string) => (
    <View style={styles.genderRow} key={label}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.genderLabel}>{label}</Text>

      <View style={styles.miniProgressTrack}>
        <View
          style={[
            styles.miniProgressBar,
            {
              width: `${value}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <Text style={styles.genderVal}>{value}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------------- HEADER ---------------- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            🏢 District Admin — {districtName}
          </Text>

          <Text style={styles.headerSubtitle}>{adminName} • Live data</Text>
        </View>

        <View style={styles.headerRight}>
          <CustomDropdown />

          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => showToast('Exporting district report...')}
          >
            <Text style={styles.exportText}>📥 Export</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.lockIcon} onPress={logOut}>
            <AppIcon type="Feather" name="lock" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ---------------- BODY ---------------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.main}
      >
        {/* ---------------- STATS ---------------- */}
        <View style={styles.statsBar}>
          <StatCard
            label="POPULATION"
            value={stats?.total_population || 0}
            sub={stats?.population_trend || ''}
            color="#0F172A"
          />

          <StatCard
            label="LITERACY"
            value={stats?.literacy_rate || '0%'}
            sub="Above state avg"
            color="#10B981"
          />

          <StatCard
            label="VERIFIED %"
            value={stats?.verified_percent || '0%'}
            sub={stats?.verified_count_label || ''}
            color="#1E3A8A"
          />

          <StatCard
            label="FRAUD FLAGGED"
            value={stats?.flagged_rate || '0'}
            sub={`${stats?.flagged_count || 0} cases`}
            color="#EF4444"
          />
        </View>

        {/* ---------------- CONTENT ---------------- */}
        <View style={styles.content}>
          {/* LEFT */}
          <View style={styles.left}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>POPULATION BY WARD</Text>

              <BarChart
                data={barData}
                barWidth={44}
                spacing={20}
                noOfSections={3}
                hideRules
                yAxisThickness={0}
                xAxisThickness={0}
                barBorderRadius={6}
                isAnimated
                animationDuration={1500}
                xAxisLabelTextStyle={styles.xAxisText}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>EMPLOYMENT SPLIT</Text>

              {(charts?.employment_split || []).map(
                (item: any, index: number) =>
                  renderEmploymentRow(
                    item?.label,
                    Number(item?.value || 0),
                    employmentColors[index % employmentColors.length],
                  ),
              )}
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.right}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>GENDER DISTRIBUTION</Text>

              <View style={styles.genderWrap}>
                <PieChart
                  data={pieData}
                  donut
                  radius={45}
                  innerRadius={28}
                  isAnimated
                  animationDuration={1200}
                  centerLabelComponent={() => (
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}
                    >
                      {centerPercent}%
                    </Text>
                  )}
                />

                <View style={{ flex: 1 }}>
                  {(charts?.gender_distribution || []).map((item: any) =>
                    renderGenderLegend(
                      item?.label,
                      item?.percentage,
                      item?.label === 'Male'
                        ? '#3B82F6'
                        : item?.label === 'Female'
                        ? '#C084FC'
                        : '#CBD5E1',
                    ),
                  )}
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>SURVEY COMPLETION HEATMAP</Text>

              <FlatList
                data={heatmapRows}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <FlatList
                    data={item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ marginBottom: 8 }}
                    renderItem={({ item: color, index }) => (
                      <Animated.View
                        key={index}
                        style={[
                          styles.heatBox,
                          {
                            backgroundColor: color,
                            opacity: masterAnim,
                            transform: [{ scale: masterAnim }],
                          },
                        ]}
                      />
                    )}
                  />
                )}
              />

              <View style={styles.legend}>
                <Text style={styles.legendText}>Low coverage</Text>
                <Text style={styles.legendText}>High coverage</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ---------------- CARD ---------------- */
const StatCard = ({ label, value, sub, color }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statSub}>{sub}</Text>
  </View>
);

/* ---------------- STYLE ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },

  main: {
    backgroundColor: '#F1F5F9',
    paddingBottom: 40,
  },

  header: {
    height: 70,
    paddingHorizontal: 20,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 3,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  exportButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },

  exportText: {
    color: '#0F172A',
    fontWeight: '700',
  },

  lockIcon: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#334155',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsBar: {
    flexDirection: 'row',
    padding: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 4,
  },

  statSub: {
    fontSize: 12,
    color: '#94A3B8',
  },

  content: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },

  left: {
    flex: 0.55,
    paddingRight: 10,
  },

  right: {
    flex: 0.45,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  cardTitle: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 20,
  },

  xAxisText: {
    fontSize: 10,
    color: '#64748B',
  },

  employmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  rowLabel: {
    width: 100,
    fontSize: 12,
    color: '#334155',
  },

  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEF2F7',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 10,
  },

  progressBar: {
    height: '100%',
  },

  rowPercent: {
    width: 40,
    fontWeight: '700',
    textAlign: 'right',
  },

  genderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heatBox: {
    width: 60,
    height: 48,
    borderRadius: 6,
    marginRight: 10,
  },

  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    marginRight: 8,
  },

  genderLabel: {
    width: 55,
    fontSize: 11,
    color: '#64748B',
  },

  miniProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#EEF2F7',
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 8,
  },

  miniProgressBar: {
    height: '100%',
  },

  genderVal: {
    width: 30,
    fontSize: 11,
    fontWeight: '700',
  },

  heatRow: {
    flexDirection: 'row',
    gap: 8,
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  legendText: {
    color: '#94A3B8',
    fontSize: 12,
  },

  stateBtn: {
    backgroundColor: '#1E3A8A',
    padding: 13,
    borderRadius: 8,
    marginTop: 18,
    alignItems: 'center',
  },

  stateBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default DistrictDashboardScreen;
