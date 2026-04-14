import React, { useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  StatusBar,
} from 'react-native';
import { isTablet } from '../../utils/responsive';
import AppIcon from '../../components/common/AppIcon';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme/colors';
import { useLocation } from '../../services/locationService';
import { useAppDispatch } from '../../store/hooks';
import { GetDistrictsApi, GetStatesApi } from '../../store/slices/commonSlice';
const HouseholdScreen = () => {
  const navigation = useNavigation<any>();
  const IsFocused = useIsFocused();
  const { location } = useLocation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (IsFocused) {
      const params = {
        stateId: 588,
      };
      // dispatch(GetStatesApi());
      // dispatch(GetDistrictsApi(params));
    }
  }, [IsFocused]);

  const generateHHId = (state: any, district: any) => {
    const year = new Date().getFullYear();

    const stateCode = state?.slice(0, 2).toUpperCase() || 'XX';
    const districtCode =
      district
        ?.split(' ')
        .map((word: any[]) => word[0])
        .join('')
        .toUpperCase() || 'X';

    const randomId = Math.floor(1000 + Math.random() * 9000); // 4 digit

    return `HH-${year}-${stateCode}-${districtCode}-${randomId}`;
  };

  const [form, setForm] = React.useState({
    headName: '',
    mobile: '',
    state: '',
    district: '',
    address: '',
    aadhaar: '',
  });

  useEffect(() => {
    console.log('location====>', location);
    if (location?.state && location?.district) {
      const id = generateHHId(location?.state, location?.district);
      setHhId(id);
    }
  }, [location]);

  const [errors, setErrors] = React.useState<any>({});
  const [hhId, setHhId] = React.useState('');

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));

    // remove error when typing
    setErrors((prev: any) => ({ ...prev, [key]: '' }));
  };

  const validateForm = () => {
    let newErrors: any = {};

    if (!form.headName.trim()) {
      newErrors.headName = 'Head name is required';
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }

    // if (!form.state) {
    //   newErrors.state = 'State is required';
    // }

    // if (!form.district) {
    //   newErrors.district = 'District is required';
    // }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!form.aadhaar) {
      errors.aadhaar = 'Required';
    } else if (form.aadhaar.length !== 12) {
      errors.aadhaar = 'Aadhaar must be 12 digits';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const payload = {
      ...form,
      hhId,
      latitude: location?.latitude,
      longitude: location?.longitude,
    };

    console.log('FINAL DATA =>', payload);

    navigation.navigate('AddMembers', { data: payload });
  };
  const formatAadhaar = (value: string) => {
    // remove non-numeric
    let cleaned = value.replace(/\D/g, '');

    // limit to 12 digits
    cleaned = cleaned.slice(0, 12);

    // split into groups
    const part1 = cleaned.slice(0, 4);
    const part2 = cleaned.slice(4, 8);
    const part3 = cleaned.slice(8, 12);

    let result = '';

    if (part1) result += part1;
    if (part2) result += (result ? ' ' : '') + part2;
    if (part3) result += (result ? ' ' : '') + part3;

    return result.trim();
  };

  const handleAadhaarChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);

    setForm(prev => ({
      ...prev,
      aadhaar: cleaned, // store original digits
    }));

    setErrors((prev: any) => ({ ...prev, aadhaar: '' }));
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header / Stepper Section */}
      <StatusBar translucent barStyle="default" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={() => navigation.goBack()}
          >
            <AppIcon type="Ionicons" name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerTitle}>+ Add Household</Text>
            <Text style={styles.headerSub}>Step 1 of 4 • Ward 12, Saket</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>{hhId}</Text>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.grid, isTablet && styles.gridTablet]}>
          {/* Column 1: Identity & Address */}
          <View style={styles.column}>
            <View style={styles.card}>
              <Text style={styles.cardHeader}>HOUSEHOLD IDENTITY</Text>
              <FormInput
                label="Auto-generated ID"
                value={hhId}
                editable={false}
              />
              <FormInput
                label="Head of Family *"
                placeholder={'Head of family'}
                value={form.headName}
                onChangeText={(val: string) => handleChange('headName', val)}
                error={errors.headName}
              />
              <FormInput
                label="Mobile Number *"
                placeholder={'Mobile number'}
                value={form.mobile}
                onChangeText={(val: string) => handleChange('mobile', val)}
                error={errors.mobile}
              />
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
                placeholder={'Full Address'}
                value={form.address}
                onChangeText={(val: string) => handleChange('address', val)}
                error={errors.address}
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
                inputMode="numeric"
                maxLength={14} // with spaces
                placeholder="XXXX XXXX 1234"
                value={formatAadhaar(form.aadhaar)}
                onChangeText={handleAadhaarChange}
                error={errors.aadhaar}
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
                  <Text
                    style={styles.coordsText}
                  >{`${location?.latitude.toFixed(
                    4,
                  )}°N ${location?.longitude.toFixed(4)}°E`}</Text>
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
          // onPress={() => navigation.navigate('AddMembers')}
          onPress={handleSave}
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
  inputMode,
  maxLength,
  placeholder,
  editable = true,
  isDropdown = false,
  multiline = false,
  onChangeText,
  error,
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>

    <View
      style={[
        styles.inputWrapper,
        !editable && styles.disabledInput,
        error && { borderColor: 'red' },
      ]}
    >
      <TextInput
        inputMode={inputMode}
        value={value}
        editable={editable}
        placeholder={placeholder}
        multiline={multiline}
        maxLength={maxLength}
        style={styles.inputText}
        onChangeText={onChangeText}
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

    {error && <Text style={{ color: 'red', fontSize: 11 }}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#E2E8F0' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#0F172A' },
  headerTop: {
    flexDirection: 'row',
    // backgroundColor: '#0F172A',
    alignItems: 'center',
  },
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
    paddingHorizontal: 20,
  },
  stepActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  stepInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.dark1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  stepTextActive: { color: '#fff', fontWeight: 'bold' },
  stepTextInactive: { color: '#fff' },
  stepLineActive: { flex: 1, height: 4, backgroundColor: '#1E3A8A' },
  stepLineInactive: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.dark1,
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
