import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '../../components/common/showToast';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { GetStateDashboardApi } from '../../store/slices/commonSlice';
import { FONTS } from '../../theme/fonts';

const StatePerformanceScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const { StateDashboardData } = useSelector((state: any) => state.common);

  /* ---------------- API CALL ---------------- */
  useEffect(() => {
    if (isFocused) {
      dispatch(GetStateDashboardApi());
    }
  }, [isFocused]);

  /* ---------------- DATA EXTRACTION ---------------- */
  const data = StateDashboardData || {};
  const topStats = data.top_stats || {};
  const fraud = data.fraud_panel || {};
  const rankings = data.district_ranking?.ranking || [];
  const risks = data.high_risk_districts?.high_risk_districts || [];

  /* remove duplicates + sort */
  const uniqueRankings = Array.from(
    new Map(rankings.map((item: any) => [item.name, item])).values(),
  );

  const sortedRankings = uniqueRankings.sort(
    (a: any, b: any) => b.raw_rate - a.raw_rate,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Text style={styles.emojiIcon}>🏢</Text>
            <Text style={styles.title}>
              State Dashboard — {data?.state_name || '-'}
            </Text>
          </View>
          <Text style={styles.subtitle}>
            {data?.admin_name || '-'} · State Director · Real-time
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
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <SummaryCard
            label="DISTRICTS"
            value={topStats?.districts?.label || '-'}
            subValue={topStats?.districts?.percentage_label || ''}
          />
          <SummaryCard
            label="HOUSEHOLDS"
            value={topStats?.households?.count || '-'}
            subValue={topStats?.households?.subtext || ''}
          />
          <SummaryCard
            label="COMPLETION"
            value={topStats?.completion?.completion_rate || '-'}
            subValue={topStats?.completion?.trend || ''}
            highlightColor="#10B981"
          />
          <SummaryCard
            label="RISK ALERTS"
            value={topStats?.risk_alerts?.alert_count || '-'}
            subValue={topStats?.risk_alerts?.affected_districts || ''}
            highlightColor="#EF4444"
          />
        </View>

        {/* Main Grid */}
        <View style={styles.mainGrid}>
          {/* Left */}
          <View style={styles.leftCol}>
            {/* Fraud Panel */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>VERIFICATION & FRAUD PANEL</Text>

              <ProgressBar
                label="Verified"
                value={parseInt(fraud?.verified_p || 0)}
                color="#10B981"
                icon="✅"
              />
              <ProgressBar
                label="Pending"
                value={parseInt(fraud?.pending_p || 0)}
                color="#F59E0B"
                icon="⏳"
              />
              <ProgressBar
                label="Flagged"
                value={parseInt(fraud?.flagged_p || 0)}
                color="#EF4444"
                icon="🚩"
              />
            </View>

            {/* High Risk */}
            <View style={[styles.card, { marginTop: 16 }]}>
              <Text style={styles.cardTitle}>HIGH-RISK DISTRICTS</Text>

              {risks.length > 0 ? (
                risks.map((item: any, index: number) => (
                  <RiskItem
                    key={index}
                    label={item.name}
                    valueText={item.flags}
                    color="#FEE2E2"
                    textColor="#B91C1C"
                  />
                ))
              ) : (
                <Text>No high-risk districts</Text>
              )}
            </View>
          </View>

          {/* Right */}
          <View style={styles.rightCol}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>DISTRICT RANKING</Text>

              {sortedRankings.slice(0, 6).map((item: any, index: number) => {
                let color = '#EF4444';

                if (item.raw_rate >= 75) color = '#10B981';
                else if (item.raw_rate >= 50) color = '#3B82F6';
                else if (item.raw_rate >= 25) color = '#F59E0B';

                return (
                  <RankingRow
                    key={index}
                    rank={(index + 1).toString()}
                    name={item.name}
                    percentage={`${item.raw_rate}%`}
                    color={color}
                  />
                );
              })}

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

/* ---------------- COMPONENTS ---------------- */

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
        style={[styles.rankBar, { width: percentage, backgroundColor: color }]}
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

/* ---------------- STYLES ---------------- */

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

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: FONTS.Bold,
    color: '#fff',
  },
  subtitle: { fontSize: 14, fontFamily: FONTS.Bold, color: '#fff' },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  headerLeft: { flexDirection: 'column' },
  titleRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 10 },

  emojiIcon: {
    fontSize: 18,
    marginRight: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    padding: 2,
  },

  headerRight: { flexDirection: 'row', alignItems: 'center' },

  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },

  dropdownText: { color: '#fff', marginRight: 8 },
  dropdownArrow: { color: '#fff' },

  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  progressLabel: {
    fontSize: 14,
    paddingVertical: 10,
    fontFamily: FONTS.Bold,
    color: '#4B5563',
  },

  progressValue: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  exportIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  exportText: { color: '#0F172A', fontWeight: 'bold' },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
  },

  labelSmall: {
    fontSize: 12,
    paddingBottom: 5,
    color: '#6B7280',
    fontFamily: FONTS.Bold,
  },
  valueLarge: {
    fontSize: 28,
    paddingBottom: 5,
    fontWeight: 'bold',
    fontFamily: FONTS.Bold,
  },
  subValue: { fontSize: 12, color: '#9CA3AF', fontFamily: FONTS.Bold },

  mainGrid: { flexDirection: 'row' },
  leftCol: { flex: 1, marginRight: 16 },
  rightCol: { flex: 1 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
  },

  cardTitle: { fontWeight: '700', marginBottom: 16 },

  progressContainer: { marginBottom: 16 },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  track: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },

  bar: { height: '100%' },

  rankingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  rankNum: { width: 24, fontWeight: 'bold' },
  rankName: { flex: 1 },

  rankTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },

  rankBar: { height: '100%' },

  rankBadge: { paddingHorizontal: 6, paddingVertical: 2 },

  riskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  riskLabel: { fontWeight: '600' },
  riskValue: { fontWeight: '700' },

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
