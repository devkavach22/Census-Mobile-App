import React, { useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { showToast } from '../../components/common/showToast';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../../components/common/AppIcon';
import { removeStorageData, STORAGE_KEYS } from '../../utils/storage';
import { AuthContext } from '../../../App';
import { updateState } from '../../store/slices/commonSlice';
import { useAppDispatch } from '../../store/hooks';

// --- DATA CONSTANTS ---
const COLORS = {
  high: '#10B981', // Green
  medium: '#3B82F6', // Blue
  low: '#EF4444', // Red
  warning: '#F59E0B', // Amber/Orange
};

const top5States = [
  {
    rank: '1.',
    name: 'Kerala',
    score: '98.2%',
    color: '#D1FAE5',
    textColor: '#065F46',
  },
  {
    rank: '2.',
    name: 'Tamil Nadu',
    score: '96.7%',
    color: '#D1FAE5',
    textColor: '#065F46',
  },
  {
    rank: '3.',
    name: 'Himachal',
    score: '94.1%',
    color: '#D1FAE5',
    textColor: '#065F46',
  },
  {
    rank: '4.',
    name: 'Karnataka',
    score: '89.4%',
    color: '#DBEAFE',
    textColor: '#1E40AF',
  },
  {
    rank: '5.',
    name: 'Maharashtra',
    score: '87.9%',
    color: '#DBEAFE',
    textColor: '#1E40AF',
  },
];

const bottom5States = [
  {
    icon: '⚠',
    name: 'Uttar Pradesh',
    score: '41%',
    color: '#FEE2E2',
    textColor: '#991B1B',
  },
  {
    icon: '⚠',
    name: 'Bihar',
    score: '48.7%',
    color: '#FEF3C7',
    textColor: '#92400E',
  },
  {
    icon: '↓',
    name: 'Jharkhand',
    score: '51.3%',
    color: '#FEF3C7',
    textColor: '#92400E',
  },
  {
    icon: '↓',
    name: 'Assam',
    score: '54.8%',
    color: '#FEF3C7',
    textColor: '#92400E',
  },
  {
    icon: '↓',
    name: 'Rajasthan',
    score: '58.2%',
    color: '#FEF3C7',
    textColor: '#92400E',
  },
];

// --- MAP COMPONENT ---
const IndiaGridMap = () => {
  const Block = ({ name, color, flex = 1, marginRight = 8 }: any) => (
    <View
      style={[styles.mapBlock, { backgroundColor: color, flex, marginRight }]}
    >
      <Text style={styles.mapBlockText} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );

  return (
    <View style={styles.mapContainerInner}>
      {/* Row 1: Punjab, Rajasthan, Bihar */}
      <View style={styles.mapRow}>
        <View style={{ flex: 0.2 }} />
        <Block name="Punjab" color={COLORS.high} flex={0.6} />
        <Block name="Rajasthan 82%" color={COLORS.medium} flex={1.2} />
        <Block name="Bihar" color={COLORS.warning} flex={0.6} marginRight={0} />
      </View>

      {/* Row 2: MP, UP, WB */}
      <View style={styles.mapRow}>
        <View style={{ flex: 0.6 }} />
        <Block name="MP 48%" color={COLORS.low} flex={0.8} />
        <Block name="UP 41%" color={COLORS.warning} flex={0.8} />
        <Block name="WB 91%" color={COLORS.high} flex={0.6} marginRight={0} />
      </View>

      {/* Row 3: Maharashtra, Odisha */}
      <View style={styles.mapRow}>
        <View style={{ flex: 0.5 }} />
        <Block name="Maharashtra" color={COLORS.medium} flex={1} />
        <Block name="Odisha" color={COLORS.high} flex={0.8} marginRight={0} />
        <View style={{ flex: 0.4 }} />
      </View>

      {/* Row 4: Karnataka, AP/TS */}
      <View style={styles.mapRow}>
        <View style={{ flex: 0.4 }} />
        <Block name="Karnataka" color={COLORS.warning} flex={0.8} />
        <Block name="AP / TS" color={COLORS.low} flex={0.8} marginRight={0} />
        <View style={{ flex: 0.6 }} />
      </View>

      {/* Row 5: Tamil Nadu, Kerala */}
      <View style={styles.mapRow}>
        <View style={{ flex: 0.7 }} />
        <Block name="Tamil Nadu" color={COLORS.high} flex={0.7} />
        <Block name="Kerala" color={COLORS.medium} flex={0.6} marginRight={0} />
        <View style={{ flex: 0.6 }} />
      </View>

      {/* Map Legend */}
      <View style={styles.legendWrapper}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.high }]} />
          <Text style={styles.legendText}>High 80%+</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: COLORS.medium }]}
          />
          <Text style={styles.legendText}>Med 60-80%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.low }]} />
          <Text style={styles.legendText}>Low/Risk</Text>
        </View>
      </View>
    </View>
  );
};

// --- MAIN SCREEN ---
const NationalDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { userRole, setIsLoggedIn } = useContext(AuthContext);
  const dispatch = useAppDispatch();

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            🏛️ National Dashboard · Census HQ
          </Text>
          <Text style={styles.headerSubtitle}>
            Rajiv Nair, Secretary · MHA · Live
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
          <TouchableOpacity
            style={styles.auditButton}
            onPress={() => showToast('Downloading national audit report...')}
          >
            <Text style={styles.auditButtonText}>📥 Audit Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.lockIcon} onPress={logOut}>
            <AppIcon type="Feather" name="lock" size={18} color="#CBD5F5" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container}>
        {/* HEADER */}

        <View style={styles.contentPadding}>
          {/* TOP KPI CARDS */}
          <View style={styles.row}>
            <View
              style={[
                styles.card,
                styles.kpiCard,
                { borderLeftColor: '#3B82F6', borderLeftWidth: 4 },
              ]}
            >
              <Text style={styles.kpiLabel}>STATES</Text>
              <Text style={styles.kpiValue}>28/28</Text>
              <Text style={styles.kpiSub}>+ 8 UTs</Text>
            </View>
            <View
              style={[
                styles.card,
                styles.kpiCard,
                { borderLeftColor: '#10B981', borderLeftWidth: 4 },
              ]}
            >
              <Text style={styles.kpiLabel}>HOUSEHOLDS</Text>
              <Text style={[styles.kpiValue, { color: '#10B981' }]}>
                31.2 Cr
              </Text>
              <Text style={styles.kpiSub}>of 35 Cr target</Text>
            </View>
            <View
              style={[
                styles.card,
                styles.kpiCard,
                { borderLeftColor: '#1E3A8A', borderLeftWidth: 4 },
              ]}
            >
              <Text style={styles.kpiLabel}>POPULATION</Text>
              <Text style={[styles.kpiValue, { color: '#1E3A8A' }]}>
                96.4 Cr
              </Text>
              <Text style={styles.kpiSub}>71.2% complete</Text>
            </View>
            <View
              style={[
                styles.card,
                styles.kpiCard,
                { borderLeftColor: '#EF4444', borderLeftWidth: 4 },
              ]}
            >
              <Text style={styles.kpiLabel}>FRAUD</Text>
              <Text style={[styles.kpiValue, { color: '#EF4444' }]}>2.4L</Text>
              <Text style={styles.kpiSub}>Detected cases</Text>
            </View>
          </View>

          {/* MIDDLE SECTION: Grid Map + Lists */}
          <View style={[styles.row, { marginTop: 16 }]}>
            <View style={[styles.card, styles.mapOuterContainer]}>
              <Text style={styles.sectionTitle}>GEOGRAPHICAL PROGRESS</Text>
              <IndiaGridMap />
            </View>

            <View style={styles.rightColumn}>
              {/* Top 5 */}
              <View style={[styles.card, { flex: 1, marginBottom: 16 }]}>
                <Text style={styles.sectionTitle}>TOP 5 STATES</Text>
                {top5States.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text style={styles.listRank}>{item.rank}</Text>
                      <Text style={styles.listName}>{item.name}</Text>
                    </View>
                    <View
                      style={[styles.badge, { backgroundColor: item.color }]}
                    >
                      <Text
                        style={[styles.badgeText, { color: item.textColor }]}
                      >
                        {item.score}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Bottom 5 */}
              <View style={[styles.card, { flex: 1 }]}>
                <Text style={styles.sectionTitle}>BOTTOM 5 / HIGH-RISK</Text>
                {bottom5States.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text style={[styles.listRank, { color: '#EF4444' }]}>
                        {item.icon}
                      </Text>
                      <Text style={styles.listName}>{item.name}</Text>
                    </View>
                    <View
                      style={[styles.badge, { backgroundColor: item.color }]}
                    >
                      <Text
                        style={[styles.badgeText, { color: item.textColor }]}
                      >
                        {item.score}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* BOTTOM SECTION: Fraud & Data Quality */}
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.sectionTitle}>FRAUD & DATA QUALITY</Text>
            <View style={styles.row}>
              <View style={[styles.fraudCard, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.fraudValue, { color: '#DC2626' }]}>
                  1.84L
                </Text>
                <Text style={[styles.fraudLabel, { color: '#DC2626' }]}>
                  Duplicate HHs
                </Text>
              </View>
              <View style={[styles.fraudCard, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.fraudValue, { color: '#D97706' }]}>
                  62,410
                </Text>
                <Text style={[styles.fraudLabel, { color: '#D97706' }]}>
                  Fake / Invalid IDs
                </Text>
              </View>
              <View style={[styles.fraudCard, { backgroundColor: '#F3E8FF' }]}>
                <Text style={[styles.fraudValue, { color: '#7E22CE' }]}>7</Text>
                <Text style={[styles.fraudLabel, { color: '#7E22CE' }]}>
                  High-Risk States
                </Text>
              </View>
              <View style={[styles.fraudCard, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.fraudValue, { color: '#0369A1' }]}>
                  4.2
                </Text>
                <Text style={[styles.fraudLabel, { color: '#0369A1' }]}>
                  Enumerator Risk Index
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={styles.btnDrillDown}
                  onPress={() =>
                    showToast(
                      'Drill-down: State -> District -> Ward -> Household',
                    )
                  }
                >
                  <Text style={styles.btnDrillDownText}>🔍 Drill Down</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnAudit}
                  onPress={() =>
                    showToast('Downloading audit reports(Pdf + Excel)...')
                  }
                >
                  <Text style={styles.btnAuditText}>📥 Audit Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnEscalate}
                  onPress={() =>
                    showToast('🚨 Escalation sent to 7 high-risk state DMs')
                  }
                >
                  <Text style={styles.btnEscalateText}>🚨 Escalate</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.btnStateView}
                onPress={() => navigation.navigate('StatePerformance')}
              >
                <Text style={styles.btnStateViewText}>← State View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#94A3B8', fontSize: 13, marginTop: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  liveText: { color: '#10B981', fontWeight: 'bold', fontSize: 12 },
  auditButton: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  auditButtonText: { color: '#0F172A', fontWeight: '600', fontSize: 12 },
  contentPadding: { padding: 16 },
  row: { flexDirection: 'row', gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  kpiCard: { flex: 1, padding: 12 },
  kpiLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  kpiValue: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  kpiSub: { color: '#94A3B8', fontSize: 11, marginTop: 2 },

  // MAP STYLES
  mapOuterContainer: { flex: 1.6, backgroundColor: '#E0F2FE' },
  mapContainerInner: { paddingVertical: 10 },
  mapRow: {
    flexDirection: 'row',
    height: 48,
    marginBottom: 6,
    alignItems: 'center',
  },
  mapBlock: {
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mapBlockText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  legendWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 2, marginRight: 6 },
  legendText: { fontSize: 11, color: '#64748B', fontWeight: '600' },

  rightColumn: { flex: 1 },
  sectionTitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  listRank: { color: '#64748B', width: 20, fontSize: 14, fontWeight: 'bold' },
  listName: { fontSize: 14, color: '#1E293B', fontWeight: '500' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  fraudCard: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  fraudValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  fraudLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    alignItems: 'center',
  },
  btnDrillDown: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnDrillDownText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  btnAudit: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnAuditText: { color: '#334155', fontWeight: 'bold', fontSize: 12 },
  btnEscalate: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnEscalateText: { color: '#DC2626', fontWeight: 'bold', fontSize: 12 },
  btnStateView: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnStateViewText: { color: '#0F172A', fontWeight: 'bold', fontSize: 12 },
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

export default NationalDashboardScreen;
