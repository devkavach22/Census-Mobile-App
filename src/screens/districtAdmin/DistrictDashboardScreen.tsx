import React, { useContext, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
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
import { useNavigation } from '@react-navigation/native';

const DistrictDashboardScreen = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  // Animation controller for Heatmap and Custom Elements
  const masterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(masterAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();
  }, []);

  const logOut = async () => {
    await removeStorageData(STORAGE_KEYS.LOGIN_DATA);
    setIsLoggedIn(false);
  };

  const barData = [
    { value: 230, label: 'Saket', frontColor: '#3B82F6' },
    { value: 180, label: 'Vasant', frontColor: '#3B82F6' },
    { value: 250, label: 'GK-1', frontColor: '#3B82F6' },
    { value: 150, label: 'GK-2', frontColor: '#BFDBFE' },
    { value: 190, label: 'Hauz', frontColor: '#3B82F6' },
    { value: 130, label: 'Lajpat', frontColor: '#BFDBFE' },
    { value: 210, label: 'Malviya', frontColor: '#3B82F6' },
  ];

  const pieData = [
    { value: 52, color: '#3B82F6', text: '52%' },
    { value: 44, color: '#C084FC' },
    { value: 4, color: '#CBD5E1' },
  ];

  const heatmapData = [
    [
      '#3B82F6',
      '#60A5FA',
      '#ED8936',
      '#1E40AF',
      '#10B981',
      '#93C5FD',
      '#F87171',
      '#3B82F6',
      '#059669',
      '#93C5FD',
    ],
    [
      '#10B981',
      '#FBD38D',
      '#3B82F6',
      '#3B82F6',
      '#10B981',
      '#FCA5A5',
      '#60A5FA',
      '#60A5FA',
      '#1E40AF',
      '#F6AD55',
    ],
  ];

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
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.rowPercent}>{percentage}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            🏢 District Admin — South Delhi
          </Text>
          <Text style={styles.headerSubtitle}>
            Priya Singh, DM Office • Live data
          </Text>
        </View>
        <View style={styles.headerRightContainer}>
          <CustomDropdown />
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => showToast('Exporting district report as PDF...')}
          >
            <Text style={styles.exportButtonText}>📥 Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.lockIcon} onPress={logOut}>
            <AppIcon type="Feather" name="lock" size={18} color="#CBD5F5" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP STAT CARDS */}
        <View style={styles.statsBar}>
          <StatCard
            label="POPULATION"
            value="4,82,136"
            sub="↑ 2.1% vs last"
            color="#0F172A"
          />
          <StatCard
            label="LITERACY"
            value="91.2%"
            sub="Above state avg"
            color="#10B981"
          />
          <StatCard
            label="VERIFIED %"
            value="78.4%"
            sub="12,340 verified"
            color="#1E3A8A"
          />
          <StatCard
            label="FRAUD FLAGGED"
            value="1.8%"
            sub="224 cases"
            color="#EF4444"
          />
        </View>

        <View style={styles.mainContent}>
          {/* LEFT COLUMN */}
          <View style={styles.leftColumn}>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>POPULATION BY WARD</Text>
              <BarChart
                data={barData}
                barWidth={32}
                noOfSections={3}
                barBorderRadius={6}
                frontColor="#3B82F6"
                isAnimated // Bar Chart Animation
                animationDuration={1500}
                initialSpacing={10}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules
                yAxisLabelContainerStyle={{ width: 0 }}
                labelWidth={40}
                xAxisLabelTextStyle={styles.xAxisText}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>EMPLOYMENT SPLIT</Text>
              {renderEmploymentRow('Salaried', 38, '#1D4ED8')}
              {renderEmploymentRow('Self-employed', 26, '#2563EB')}
              {renderEmploymentRow('Daily wage', 18, '#D97706')}
              {renderEmploymentRow('Unemployed', 12, '#DC2626')}
              {renderEmploymentRow('Student', 6, '#059669')}
            </View>
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightColumn}>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>GENDER DISTRIBUTION</Text>
              <View style={styles.rowAlignCenter}>
                <View style={styles.donutWrapper}>
                  <PieChart
                    data={pieData}
                    donut
                    isAnimated // Donut Animation
                    animationDuration={1200}
                    radius={45}
                    innerRadius={30}
                    centerLabelComponent={() => (
                      <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                        52%
                      </Text>
                    )}
                  />
                </View>
                <View style={styles.genderStats}>
                  {renderGenderLegend('Male', '52%', '#3B82F6')}
                  {renderGenderLegend('Female', '44%', '#C084FC')}
                  {renderGenderLegend('Other', '4%', '#CBD5E1')}
                </View>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>SURVEY COMPLETION HEATMAP</Text>
              <View style={styles.heatmapGrid}>
                {heatmapData.map((row, rIdx) => (
                  <View key={rIdx} style={styles.heatmapRow}>
                    {row.map((color, cIdx) => {
                      // Custom Staggered Animation for Heatmap
                      const scale = masterAnim.interpolate({
                        inputRange: [0, 0.4, 1],
                        outputRange: [0, 0, 1],
                      });

                      return (
                        <Animated.View
                          key={cIdx}
                          style={[
                            styles.heatmapBox,
                            {
                              backgroundColor: color,
                              opacity: masterAnim,
                              transform: [{ scale: scale }],
                            },
                          ]}
                        />
                      );
                    })}
                  </View>
                ))}
              </View>
              <View style={styles.heatmapLegend}>
                <Text style={styles.legendText}>Low coverage</Text>
                <Text style={styles.legendText}>High coverage</Text>
              </View>
              <TouchableOpacity
                style={styles.stateViewBtn}
                onPress={() => navigation.navigate('StatePerformance')}
              >
                <Text style={styles.stateViewBtnText}>↑ State View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ label, value, sub, color }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statSub}>{sub}</Text>
  </View>
);

const renderGenderLegend = (label: string, val: string, color: string) => (
  <View style={styles.genderRow}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={styles.genderLabel}>{label}</Text>
    <View style={styles.miniProgressTrack}>
      <View
        style={[
          styles.miniProgressBar,
          { width: val, backgroundColor: color } as any,
        ]}
      />
    </View>
    <Text style={styles.genderVal}>{val}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  main: { backgroundColor: '#F1F5F9', paddingBottom: 40 },
  // #F1F5F9
  header: {
    height: 70,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: { flexDirection: 'column' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: '#94A3B8', fontSize: 12 },
  headerRightContainer: { flexDirection: 'row', alignItems: 'center' },
  exportButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  exportButtonText: { color: '#0F172A', fontWeight: 'bold' },
  statsBar: { flexDirection: 'row', padding: 20 },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statLabel: { color: '#64748B', fontSize: 10, fontWeight: 'bold' },
  statValue: { fontSize: 22, fontWeight: 'bold', marginVertical: 4 },
  statSub: { color: '#94A3B8', fontSize: 10 },
  mainContent: { flex: 1, flexDirection: 'row', paddingHorizontal: 15 },
  leftColumn: { flex: 0.55, paddingRight: 10 },
  rightColumn: { flex: 0.45 },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chartTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  xAxisText: { color: '#64748B', fontSize: 10 },
  employmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowLabel: { flex: 0.3, fontSize: 12, color: '#475569', fontWeight: '500' },
  progressTrack: {
    flex: 0.6,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: { height: '100%' },
  rowPercent: {
    flex: 0.15,
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#1E293B',
  },
  rowAlignCenter: { flexDirection: 'row', alignItems: 'center' },
  donutWrapper: { flex: 0.4 },
  genderStats: { flex: 0.6 },
  genderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  genderLabel: { fontSize: 11, color: '#64748B', width: 45 },
  miniProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginHorizontal: 10,
  },
  miniProgressBar: { height: '100%', borderRadius: 3 },
  genderVal: { fontSize: 11, fontWeight: 'bold', width: 30 },
  heatmapGrid: { gap: 8 },
  heatmapRow: { flexDirection: 'row', gap: 8 },
  heatmapBox: { flex: 1, height: 35, borderRadius: 6 },
  heatmapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  legendText: { fontSize: 10, color: '#94A3B8' },
  stateViewBtn: {
    backgroundColor: '#1E3A8A',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  stateViewBtnText: { color: 'white', fontWeight: 'bold' },
  lockIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginLeft: 20,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DistrictDashboardScreen;
