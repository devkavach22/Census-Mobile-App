import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '../../components/common/showToast';

const StatePerformanceScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Text style={styles.emojiIcon}>🏢</Text>
            <Text style={styles.title}>State Dashboard — Delhi</Text>
          </View>
          <Text style={styles.subtitle}>
            Anita Verma, State Director · Real-time
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.dropdownButton}>
            <Text style={styles.dropdownText}>All Districts</Text>
            <Text style={styles.dropdownArrow}>⌵</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => showToast('Exporting state report...')}
          >
            <Text style={styles.exportIcon}>📊</Text>
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container}>
        {/* Top Summary Cards */}
        <View style={styles.summaryRow}>
          <SummaryCard
            label="DISTRICTS"
            value="11/11"
            subValue="100% onboarded"
          />
          <SummaryCard
            label="HOUSEHOLDS"
            value="34.8L"
            subValue="Surveyed so far"
          />
          <SummaryCard
            label="COMPLETION"
            value="73.2%"
            subValue="↑ 4.1% this week"
            highlightColor="#10B981"
          />
          <SummaryCard
            label="RISK ALERTS"
            value="1,248"
            subValue="5 districts"
            highlightColor="#EF4444"
          />
        </View>

        {/* Main Content Body */}
        <View style={styles.mainGrid}>
          {/* Left Column: Verification & High Risk */}
          <View style={styles.leftCol}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>VERIFICATION & FRAUD PANEL</Text>
              <ProgressBar
                label="Verified"
                value={68}
                color="#10B981"
                icon="✅"
              />
              <ProgressBar
                label="Pending"
                value={24}
                color="#F59E0B"
                icon="⏳"
              />
              <ProgressBar
                label="Flagged"
                value={8}
                color="#EF4444"
                icon="🚩"
              />
            </View>

            <View style={[styles.card, { marginTop: 16 }]}>
              <Text style={styles.cardTitle}>HIGH-RISK DISTRICTS</Text>
              <RiskItem
                label="East Delhi"
                value="412 flags"
                color="#FEE2E2"
                textColor="#B91C1C"
              />
              <RiskItem
                label="North East Delhi"
                value="286 flags"
                color="#FEF3C7"
                textColor="#B45309"
              />
              <RiskItem
                label="Outer Delhi"
                value="#FEF3C7"
                valueText="194 flags"
                textColor="#B45309"
              />
            </View>
          </View>

          {/* Right Column: District Ranking */}
          <View style={styles.rightCol}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>DISTRICT RANKING</Text>
              <RankingRow
                rank="1"
                name="New Delhi"
                percentage="94%"
                color="#10B981"
              />
              <RankingRow
                rank="2"
                name="South Delhi"
                percentage="87%"
                color="#10B981"
              />
              <RankingRow
                rank="3"
                name="West Delhi"
                percentage="79%"
                color="#3B82F6"
              />
              <RankingRow
                rank="4"
                name="North Delhi"
                percentage="71%"
                color="#3B82F6"
              />
              <RankingRow
                rank="5"
                name="East Delhi"
                percentage="52%"
                color="#F59E0B"
              />
              <RankingRow
                rank="6"
                name="NE Delhi"
                percentage="41%"
                color="#EF4444"
              />

              <TouchableOpacity
                style={styles.nationalButton}
                onPress={() => navigation.navigate('NationalDashboard')}
              >
                <Text style={styles.nationalButtonText}>↑ National View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Helper Components ---

const SummaryCard = ({
  label,
  value,
  subValue,
  highlightColor = '#1F2937',
}: any) => (
  <View style={styles.summaryCard}>
    <Text style={styles.labelSmall}>{label}</Text>
    <Text style={[styles.valueLarge, { color: highlightColor }]}>{value}</Text>
    <Text style={styles.subValue}>{subValue}</Text>
  </View>
);

const ProgressBar = ({ label, value, color, icon }: any) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>
        {icon} {label}
      </Text>
      <Text style={[styles.progressValue, { color }]}>{value}%</Text>
    </View>
    <View style={styles.track}>
      <View
        style={[styles.bar, { width: `${value}%`, backgroundColor: color }]}
      />
    </View>
  </View>
);

const RankingRow = ({ rank, name, percentage, color }: any) => (
  <View style={styles.rankingRow}>
    <Text style={styles.rankNum}>{rank}</Text>
    <Text style={styles.rankName}>{name}</Text>
    <View style={styles.rankTrack}>
      <View
        style={[
          styles.rankBar,
          { width: `${percentage}`, backgroundColor: color } as any,
        ]}
      />
    </View>
    <View style={[styles.rankBadge, { backgroundColor: `${color}20` }]}>
      <Text style={{ color, fontWeight: 'bold', fontSize: 12 }}>
        {percentage}
      </Text>
    </View>
  </View>
);

const RiskItem = ({ label, valueText, color, textColor }: any) => (
  <View style={[styles.riskItem, { backgroundColor: color }]}>
    <Text style={[styles.riskLabel, { color: textColor }]}>{label}</Text>
    <Text style={[styles.riskValue, { color: textColor }]}>{valueText}</Text>
  </View>
);

// --- Styles ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#6B7280' },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiIcon: {
    fontSize: 18,
    marginRight: 8,
    backgroundColor: '#334155', // Slight background for icon
    borderRadius: 4,
    padding: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  dropdownArrow: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Light background for Export
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  exportText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  riskValue: {
    fontWeight: '700',
    fontSize: 14,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
  },
  labelSmall: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  valueLarge: { fontSize: 28, fontWeight: 'bold', marginVertical: 4 },
  subValue: { fontSize: 12, color: '#9CA3AF' },

  mainGrid: { flexDirection: 'row' },
  leftCol: { flex: 1, marginRight: 16 },
  rightCol: { flex: 1 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },

  progressContainer: { marginBottom: 16 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: { fontSize: 14, color: '#4B5563' },
  progressValue: { fontWeight: 'bold' },
  track: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: { height: '100%', borderRadius: 4 },

  rankingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  rankNum: { width: 24, fontWeight: 'bold', color: '#10B981' },
  rankName: { flex: 1, fontSize: 14, color: '#374151' },
  rankTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginHorizontal: 12,
  },
  rankBar: { height: '100%', borderRadius: 3 },
  rankBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },

  riskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  riskLabel: { fontWeight: '600' },
  nationalButton: {
    backgroundColor: '#1E40AF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  nationalButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default StatePerformanceScreen;
