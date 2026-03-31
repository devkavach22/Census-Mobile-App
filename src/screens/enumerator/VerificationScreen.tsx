import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import AppIcon from '../../components/common/AppIcon';
import { useNavigation } from '@react-navigation/native';

const VerificationScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.mainContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle}>
          <AppIcon type="Ionicons" name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <View style={styles.headerTitleRow}>
            <Text style={{ fontSize: 18 }}>🔍</Text>
            <Text style={styles.headerTitle}>
              Verification & Fraud Detection
            </Text>
          </View>
          <Text style={styles.headerSub}>
            Rohit Sharma • HH-2024-DL-S12-1107
          </Text>
        </View>
        <View style={styles.reviewBadge}>
          <AppIcon type="Ionicons" name="warning" size={14} color="#B91C1C" />
          <Text style={styles.reviewBadgeText}>Review Required</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topRow}>
          {/* A - Identity Verification */}
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.cardSectionLabel}>
              A • IDENTITY VERIFICATION
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Aadhaar / ID (masked)</Text>
              <TextInput
                style={styles.maskedInput}
                value="XXXX  XXXX  7734"
                editable={false}
              />
            </View>

            <Text style={styles.label}>Live Photo Capture</Text>
            <TouchableOpacity style={styles.uploadBox}>
              <AppIcon
                type="Ionicons"
                name="camera"
                size={20}
                color="#475569"
              />
              <Text style={styles.uploadText}>Tap to capture photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.uploadBox,
                { borderStyle: 'solid', marginTop: 12 },
              ]}
            >
              <AppIcon
                type="Ionicons"
                name="attach"
                size={20}
                color="#475569"
              />
              <Text style={styles.uploadText}>Upload ID proof</Text>
            </TouchableOpacity>
          </View>

          {/* B - Status & Risk Score */}
          <View style={[styles.card, { flex: 1, marginLeft: 16 }]}>
            <Text style={styles.cardSectionLabel}>B • STATUS & RISK SCORE</Text>

            {/* Status Toggles */}
            <View style={styles.statusToggleRow}>
              <View style={[styles.statusTab, styles.statusVerified]}>
                <AppIcon
                  type="Ionicons"
                  name="checkbox"
                  size={24}
                  color="#166534"
                />
                <Text style={[styles.statusTabText, { color: '#166534' }]}>
                  Verified
                </Text>
              </View>
              <View
                style={[
                  styles.statusTab,
                  styles.statusPending,
                  styles.activeBorder,
                ]}
              >
                <Text style={{ fontSize: 24 }}>⏳</Text>
                <Text style={[styles.statusTabText, { color: '#92400E' }]}>
                  Pending
                </Text>
              </View>
              <View style={[styles.statusTab, styles.statusFailed]}>
                <AppIcon
                  type="Ionicons"
                  name="close-circle"
                  size={24}
                  color="#B91C1C"
                />
                <Text style={[styles.statusTabText, { color: '#B91C1C' }]}>
                  Failed
                </Text>
              </View>
            </View>

            {/* Risk Score Gauge Area */}
            <View style={styles.riskScoreContainer}>
              <View style={styles.riskCircle}>
                <Text style={styles.riskValue}>62</Text>
                <Text style={styles.riskLabel}>RISK</Text>
              </View>
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.riskLevelText}>MEDIUM RISK</Text>
                <Text style={styles.riskSubText}>
                  Duplication Score: 62/100
                </Text>
                <Text style={styles.riskSubText}>3 risk signals detected</Text>
              </View>
            </View>
          </View>
        </View>

        {/* C - AI Fraud Detection Engine */}
        <View style={styles.fraudCard}>
          <View style={styles.fraudHeader}>
            <Text style={styles.cardSectionLabel}>
              🤖 C • AI FRAUD DETECTION ENGINE
            </Text>
            <View style={styles.signalBadge}>
              <Text style={styles.signalBadgeText}>3 Signals</Text>
            </View>
          </View>

          <View style={styles.fraudGrid}>
            <FraudItem
              color="#FEE2E2"
              border="#EF4444"
              dot="#EF4444"
              title="Duplicate Identity"
              sub="Same mobile → HH-2024-1089"
            />
            <FraudItem
              color="#FEF3C7"
              border="#F59E0B"
              dot="#F59E0B"
              title="Demographic Mismatch"
              sub="Age inconsistency vs Aadhaar (±3yr)"
            />
            <FraudItem
              color="#FEF3C7"
              border="#F59E0B"
              dot="#F59E0B"
              title="GPS Proximity"
              sub="HH-1089 located 48m away"
            />
            <FraudItem
              color="#DCFCE7"
              border="#10B981"
              dot="#10B981"
              title="Enumerator Pattern"
              sub="Normal entry speed, no bulk entries"
            />
          </View>
        </View>

        {/* E - Actions & Audit Trail */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>E • ACTIONS & AUDIT TRAIL</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btnAction, { backgroundColor: '#DCFCE7' }]}
            >
              <Text style={{ color: '#15803d', fontWeight: 'bold' }}>
                ✅ Verify Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnAction,
                { backgroundColor: '#FEE2E2', marginLeft: 12 },
              ]}
            >
              <Text style={{ color: '#b91c1c', fontWeight: 'bold' }}>
                🚩 Mark Suspect
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnAction,
                { backgroundColor: '#F1F5F9', marginLeft: 12 },
              ]}
            >
              <Text style={{ color: '#334155', fontWeight: 'bold' }}>
                👤 Override
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => navigation.navigate('Survey')}
            >
              <Text style={styles.saveBtnText}>Save & Continue →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.auditLog}>
            <AppIcon
              type="Ionicons"
              name="lock-closed"
              size={14}
              color="#64748B"
            />
            <Text style={styles.auditText}>
              Audit trail: Ramesh Kumar • 14:32:07 • Action logged • IP:
              192.168.x.x
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const FraudItem = ({ color, border, dot, title, sub }: any) => (
  <View
    style={[
      styles.fraudItem,
      { backgroundColor: color, borderLeftColor: border },
    ]}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.fraudTitle, { color: border }]}>{title}</Text>
    </View>
    <Text style={[styles.fraudSub, { color: border }]}>{sub}</Text>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    backgroundColor: '#0F172A',
    padding: 20,
    paddingTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerSub: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBadge: {
    marginLeft: 'auto',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewBadgeText: {
    color: '#B91C1C',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },

  scrollContent: { padding: 16 },
  topRow: { flexDirection: 'row', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 16,
  },

  label: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  maskedInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '500',
  },

  uploadBox: {
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  uploadText: { marginLeft: 10, color: '#475569', fontWeight: '500' },

  // Status Section
  statusToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusTab: {
    flex: 1,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statusVerified: { backgroundColor: '#DCFCE7' },
  statusPending: { backgroundColor: '#FFEDD5' },
  statusFailed: { backgroundColor: '#FEE2E2' },
  activeBorder: { borderWidth: 2, borderColor: '#D97706' },
  statusTabText: { fontWeight: 'bold', marginTop: 4 },

  // Risk Score
  riskScoreContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
  },
  riskValue: { fontSize: 22, fontWeight: 'bold', color: '#D97706' },
  riskLabel: { fontSize: 8, fontWeight: 'bold', color: '#D97706' },
  riskLevelText: { color: '#D97706', fontWeight: '900', fontSize: 14 },
  riskSubText: { color: '#64748B', fontSize: 12 },

  // Fraud Section
  fraudCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  fraudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signalBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  signalBadgeText: { color: '#B45309', fontSize: 11, fontWeight: 'bold' },
  fraudGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  fraudItem: {
    width: '48.5%',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 5,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  fraudTitle: { fontWeight: 'bold', fontSize: 13 },
  fraudSub: { fontSize: 11, marginTop: 2 },

  // Action Section
  actionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  btnAction: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  saveBtn: {
    marginLeft: 'auto',
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },

  auditLog: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  auditText: { color: '#64748B', fontSize: 11, marginLeft: 8 },
  inputGroup: {
    marginBottom: 20,
  },
});

export default VerificationScreen;
