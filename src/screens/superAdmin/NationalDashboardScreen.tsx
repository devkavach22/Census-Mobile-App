import React, { useContext, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { showToast } from '../../components/common/showToast';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIcon from '../../components/common/AppIcon';
import { removeStorageData, STORAGE_KEYS } from '../../utils/storage';
import { AuthContext } from '../../../App';
import {
  GetNationalDashboardApi,
  updateState,
} from '../../store/slices/commonSlice';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';

const COLORS = {
  high: '#10B981',
  medium: '#3B82F6',
  low: '#EF4444',
  warning: '#F59E0B',
};

const NationalDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { setUserDetails } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const { NationalDashboardData } = useSelector((state: any) => state.common);
  const isFocused = useIsFocused();
  const header = NationalDashboardData?.header;
  const rankings = NationalDashboardData?.rankings;
  const fraud = NationalDashboardData?.fraud_and_quality;

  useEffect(() => {
    if (isFocused) {
      dispatch(GetNationalDashboardApi());
    }
  }, [isFocused]);

  const logOut = async () => {
    await removeStorageData(STORAGE_KEYS.LOGIN_DATA);
    dispatch(updateState({ isLogin: false, token: null, userData: null }));
    setUserDetails(null);
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
        <View style={styles.contentPadding}>
          {/* KPI CARDS */}
          <View style={styles.row}>
            <View
              style={[
                styles.card,
                styles.kpiCard,
                { borderLeftColor: '#3B82F6', borderLeftWidth: 4 },
              ]}
            >
              <Text style={styles.kpiLabel}>STATES</Text>
              <Text style={styles.kpiValue}>
                {header?.states?.count || '-'}
              </Text>
              <Text style={styles.kpiSub}>+ {header?.states?.uts}</Text>
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
                {header?.households?.actual}
              </Text>
              <Text style={styles.kpiSub}>
                of {header?.households?.target} target
              </Text>
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
                {header?.population?.actual}
              </Text>
              <Text style={styles.kpiSub}>
                {header?.population?.percentage}% complete
              </Text>
            </View>

            <View
              style={[
                styles.card,
                styles.kpiCard,
                { borderLeftColor: '#EF4444', borderLeftWidth: 4 },
              ]}
            >
              <Text style={styles.kpiLabel}>FRAUD</Text>
              <Text style={[styles.kpiValue, { color: '#EF4444' }]}>
                {header?.fraud?.detected_cases}
              </Text>
              <Text style={styles.kpiSub}>{header?.fraud?.label}</Text>
            </View>
          </View>

          {/* TOP + BOTTOM */}
          <View style={[styles.row, { marginTop: 16 }]}>
            {/* TOP 5 */}
            <View style={[styles.card, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.sectionTitle}>TOP 5 STATES</Text>
              {rankings?.top_5?.map((item: any, index: number) => {
                const isHigh = item.percentage >= 80;

                return (
                  <View key={index} style={styles.listItem}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.listRank}>{index + 1}.</Text>
                      <Text style={styles.listName}>{item.name}</Text>
                    </View>

                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: isHigh ? '#D1FAE5' : '#DBEAFE' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: isHigh ? '#065F46' : '#1E40AF' },
                        ]}
                      >
                        {item.percentage}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* BOTTOM 5 */}
            <View style={[styles.card, { flex: 1 }]}>
              <Text style={styles.sectionTitle}>BOTTOM 5 / HIGH-RISK</Text>
              {rankings?.bottom_5?.map((item: any, index: number) => {
                const isLow = item.percentage < 50;

                return (
                  <View key={index} style={styles.listItem}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.listRank, { color: '#EF4444' }]}>
                        {isLow ? '⚠' : '↓'}
                      </Text>
                      <Text style={styles.listName}>{item.name}</Text>
                    </View>

                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: isLow ? '#FEE2E2' : '#FEF3C7' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: isLow ? '#991B1B' : '#92400E' },
                        ]}
                      >
                        {item.percentage}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* FRAUD SECTION */}
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.sectionTitle}>FRAUD & DATA QUALITY</Text>

            <View style={styles.row}>
              <View style={[styles.fraudCard, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.fraudValue, { color: '#DC2626' }]}>
                  {fraud?.duplicate_hhs}
                </Text>
                <Text style={styles.fraudLabel}>Duplicate HHs</Text>
              </View>

              <View style={[styles.fraudCard, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.fraudValue, { color: '#D97706' }]}>
                  {fraud?.fake_invalid_ids}
                </Text>
                <Text style={styles.fraudLabel}>Fake / Invalid IDs</Text>
              </View>

              <View style={[styles.fraudCard, { backgroundColor: '#F3E8FF' }]}>
                <Text style={[styles.fraudValue, { color: '#7E22CE' }]}>
                  {fraud?.high_risk_states}
                </Text>
                <Text style={styles.fraudLabel}>High Risk States</Text>
              </View>

              <View style={[styles.fraudCard, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.fraudValue, { color: '#0369A1' }]}>
                  {fraud?.enumerator_risk_index}
                </Text>
                <Text style={styles.fraudLabel}>Enumerator Risk Index</Text>
              </View>
            </View>
          </View>
          <View style={styles.actionWrapper}>
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
                    showToast('Downloading audit reports (Pdf + Excel)...')
                  }
                >
                  <Text style={styles.btnAuditText}>📥 Audit Reports</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnEscalate}
                  onPress={() =>
                    showToast('🚨 Escalation sent to high-risk states')
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
  lockIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginLeft: 20,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionWrapper: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    alignItems: 'center',
  },

  btnStateView: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },

  btnStateViewText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default NationalDashboardScreen;
