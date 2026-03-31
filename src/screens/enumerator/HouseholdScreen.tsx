import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { isTablet } from '../../utils/responsive';
import AppIcon from '../../components/common/AppIcon';
import { useNavigation } from '@react-navigation/native';

const HouseholdScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.mainContainer}>
      {/* Header / Stepper Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backCircle}>
            <AppIcon type="Ionicons" name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerTitle}>+ Add Household</Text>
            <Text style={styles.headerSub}>Step 1 of 4 • Ward 12, Saket</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>HH-2024-1107</Text>
            </View>
            <View style={styles.gpsBadge}>
              <AppIcon
                type="Ionicons"
                name="location"
                size={14}
                color="#22C55E"
              />
              <Text style={styles.gpsBadgeText}>GPS</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepActive}>
            <Text style={styles.stepTextActive}>1</Text>
          </View>
          <View style={styles.stepLineActive} />
          <View style={styles.stepActive}>
            <Text style={styles.stepTextActive}>2</Text>
          </View>
          <View style={styles.stepLineInactive} />
          <View style={styles.stepInactive}>
            <Text style={styles.stepTextInactive}>3</Text>
          </View>
          <View style={styles.stepLineInactive} />
          <View style={styles.stepInactive}>
            <Text style={styles.stepTextInactive}>4</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.grid, isTablet && styles.gridTablet]}>
          {/* Column 1: Identity & Address */}
          <View style={styles.column}>
            <View style={styles.card}>
              <Text style={styles.cardHeader}>HOUSEHOLD IDENTITY</Text>
              <FormInput
                label="Auto-generated ID"
                value="HH-2024-DL-S12-1107"
                editable={false}
              />
              <FormInput label="Head of Family *" value="Mohan Lal Sharma" />
              <FormInput label="Mobile Number *" value="+91 98112 44521" />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>ADDRESS</Text>
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <FormInput label="State" value="Delhi" isDropdown />
                </View>
                <View style={{ flex: 1 }}>
                  <FormInput label="District" value="South Delhi" isDropdown />
                </View>
              </View>
              <FormInput
                label="Full Address"
                value="B-42, Pushp Vihar, Saket, ND-110017"
                multiline
              />
            </View>
          </View>

          {/* Column 2: Aadhaar & Geo-Tagging */}
          <View style={styles.column}>
            <View style={styles.card}>
              <Text style={styles.cardHeader}>AADHAAR VERIFICATION</Text>
              <View style={styles.consentBox}>
                <AppIcon
                  type="Ionicons"
                  name="calendar-outline"
                  size={16}
                  color="#B45309"
                />
                <Text style={styles.consentText}>
                  Consent required before fetching Aadhaar details.
                </Text>
              </View>
              <FormInput
                label="Aadhaar (masked)"
                value="XXXX  XXXX  4821"
                editable={false}
              />
              <View style={styles.verifiedBox}>
                <AppIcon
                  type="Ionicons"
                  name="checkmark-circle"
                  size={24}
                  color="#22C55E"
                />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.verifiedText}>Aadhaar Verified</Text>
                  <Text style={styles.verifiedSub}>Details auto-fetched</Text>
                </View>
                <Text style={styles.auditText}>Audit Logged</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>GEO-TAGGING</Text>
              <View style={styles.mapPlaceholder}>
                <View style={styles.mapDot} />
                <View style={styles.coordsBadge}>
                  <Text style={styles.coordsText}>28.5247°N 77.2066°E</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.gpsButton}>
                <AppIcon type="Ionicons" name="pin" size={16} color="#fff" />
                <Text style={styles.gpsButtonText}>Capture GPS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* AI Validation Alert Section */}
        <View style={styles.alertBox}>
          <View style={styles.alertHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>🚨</Text>
              <Text style={styles.alertTitle}>AI Validation Alert</Text>
            </View>
            <Text style={styles.alertRisk}>High Risk</Text>
          </View>
          <View style={styles.alertContentRow}>
            <Text style={styles.alertItem}>
              ⚠️ Same mobile linked to HH-2024-1089
            </Text>
            <Text style={styles.alertItem}>
              ⚠️ GPS matches existing HH (48m away)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate('AddMembers')}
        >
          <Text style={styles.saveButtonText}>Save & Continue →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Simplified Form Component for this example
const FormInput = ({
  label,
  value,
  editable = true,
  isDropdown = false,
  multiline = false,
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, !editable && styles.disabledInput]}>
      <TextInput
        value={value}
        editable={editable}
        multiline={multiline}
        style={styles.inputText}
      />
      {isDropdown && (
        <AppIcon
          type="Ionicons"
          name="chevron-down"
          size={18}
          color="#1E293B"
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#E2E8F0' },
  header: { backgroundColor: '#0F172A', padding: 20, paddingTop: 40 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: '#94A3B8', fontSize: 12 },
  headerRight: { marginLeft: 'auto', flexDirection: 'row' },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginRight: 8,
  },
  idBadgeText: { color: '#BFDBFE', fontSize: 12 },
  gpsBadge: {
    backgroundColor: '#F0FDF4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  gpsBadgeText: {
    color: '#166534',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 11,
  },

  // Stepper
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 10,
  },
  stepActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  stepInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  stepTextActive: { color: '#fff', fontWeight: 'bold' },
  stepTextInactive: { color: '#475569' },
  stepLineActive: { flex: 1, height: 4, backgroundColor: '#3B82F6' },
  stepLineInactive: {
    flex: 1,
    height: 4,
    backgroundColor: '#F1F5F9',
    opacity: 0.2,
  },

  scrollContent: { padding: 16 },
  grid: { flexDirection: 'column' },
  gridTablet: { flexDirection: 'row', gap: 16 },
  column: { flex: 1 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  // Input Styles
  inputContainer: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#1E293B', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 45,
  },
  inputText: { flex: 1, color: '#1E293B' },
  disabledInput: { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD' },
  row: { flexDirection: 'row' },

  // Specific Card UI
  consentBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  consentText: { color: '#B45309', fontSize: 12, marginLeft: 8 },
  verifiedBox: {
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: { color: '#166534', fontWeight: 'bold' },
  verifiedSub: { color: '#166534', fontSize: 11 },
  auditText: {
    marginLeft: 'auto',
    color: '#166534',
    fontWeight: 'bold',
    fontSize: 12,
  },

  mapPlaceholder: {
    height: 120,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  mapDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },
  coordsBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 4,
    elevation: 1,
  },
  coordsText: { fontSize: 10, fontWeight: 'bold' },
  gpsButton: {
    backgroundColor: '#1E3A8A',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },

  // Alert
  alertBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alertTitle: {
    color: '#B91C1C',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  alertRisk: { color: '#B91C1C', fontWeight: 'bold' },
  alertContentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  alertItem: { color: '#B91C1C', fontSize: 12 },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  backText: { color: '#1E293B', fontWeight: '600' },
  saveButton: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default HouseholdScreen;
