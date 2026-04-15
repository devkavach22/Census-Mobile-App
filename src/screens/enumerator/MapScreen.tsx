import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '../../components/common/showToast';
import { AuthContext } from '../../../App';
import AppIcon from '../../components/common/AppIcon';
import { FONTS } from '../../theme/fonts';
import { GetGeofiltersOptionsApi } from '../../store/slices/commonSlice';
import { useAppDispatch } from '../../store/hooks';

const MapScreen = () => {
  const navigation = useNavigation<any>();
  const { userDetails } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const IsFocused = useIsFocused();
  const markers = [
    {
      id: 1,
      x: '21%',
      y: '15%',
      color: '#2E7D32',
      status: 'Completed',
      householdId: 'HH-2024-1001',
      head: 'Ramesh Patel',
      risk: 22,
      issue: null,
    },
    {
      id: 4,
      x: '26%',
      y: '30%',
      color: '#9333EA',
      status: 'Flagged',
      householdId: 'HH-1042',
      head: 'Ramu Verma',
      risk: 81,
      issue: 'Duplicate Aadhaar · GPS overlap',
    },
    {
      id: 7,
      x: '26%',
      y: '58%',
      color: '#9333EA',
      status: 'Flagged',
      householdId: 'HH-2024-1089',
      head: 'Suresh Mehta',
      risk: 78,
      issue: 'Duplicate Aadhaar · GPS overlap',
    },
    {
      id: 9,
      x: '38%',
      y: '65%',
      color: '#DC2626',
      status: 'Pending',
      householdId: 'HH-2024-1022',
      head: 'Anita Sharma',
      risk: 65,
      issue: 'Verification pending',
    },
    {
      id: 15,
      x: '61%',
      y: '70%',
      color: '#F59E0B',
      status: 'In-progress',
      householdId: 'HH-2024-1033',
      head: 'Vikas Singh',
      risk: 45,
      issue: 'Survey ongoing',
    },

    // --- NEW DATA ---
    {
      id: 16,
      x: '12%',
      y: '20%',
      color: '#2E7D32',
      status: 'Completed',
      householdId: 'HH-2024-1034',
      head: 'Kiran Shah',
      risk: 18,
      issue: null,
    },
    {
      id: 17,
      x: '18%',
      y: '35%',
      color: '#DC2626',
      status: 'Pending',
      householdId: 'HH-2024-1035',
      head: 'Mahesh Yadav',
      risk: 60,
      issue: 'Documents missing',
    },
    {
      id: 18,
      x: '30%',
      y: '10%',
      color: '#2E7D32',
      status: 'Completed',
      householdId: 'HH-2024-1036',
      head: 'Sunita Joshi',
      risk: 15,
      issue: null,
    },
    {
      id: 19,
      x: '40%',
      y: '18%',
      color: '#F59E0B',
      status: 'In-progress',
      householdId: 'HH-2024-1037',
      head: 'Rahul Meena',
      risk: 40,
      issue: 'Survey ongoing',
    },
    {
      id: 20,
      x: '48%',
      y: '28%',
      color: '#2E7D32',
      status: 'Completed',
      householdId: 'HH-2024-1038',
      head: 'Neha Kapoor',
      risk: 20,
      issue: null,
    },
    {
      id: 21,
      x: '55%',
      y: '40%',
      color: '#9333EA',
      status: 'Flagged',
      householdId: 'HH-2024-1039',
      head: 'Amit Tiwari',
      risk: 85,
      issue: 'Duplicate entry found',
    },
    {
      id: 22,
      x: '65%',
      y: '25%',
      color: '#DC2626',
      status: 'Pending',
      householdId: 'HH-2024-1040',
      head: 'Pooja Singh',
      risk: 70,
      issue: 'Verification pending',
    },
    {
      id: 23,
      x: '70%',
      y: '50%',
      color: '#2E7D32',
      status: 'Completed',
      householdId: 'HH-2024-1041',
      head: 'Deepak Kumar',
      risk: 25,
      issue: null,
    },
    {
      id: 24,
      x: '75%',
      y: '65%',
      color: '#F59E0B',
      status: 'In-progress',
      householdId: 'HH-2024-1042',
      head: 'Priya Verma',
      risk: 50,
      issue: 'Survey ongoing',
    },
    {
      id: 25,
      x: '80%',
      y: '30%',
      color: '#9333EA',
      status: 'Flagged',
      householdId: 'HH-2024-1043',
      head: 'Nitin Arora',
      risk: 88,
      issue: 'GPS mismatch',
    },
    {
      id: 26,
      x: '10%',
      y: '75%',
      color: '#DC2626',
      status: 'Pending',
      householdId: 'HH-2024-1044',
      head: 'Sanjay Gupta',
      risk: 67,
      issue: 'Incomplete data',
    },
    {
      id: 27,
      x: '22%',
      y: '82%',
      color: '#2E7D32',
      status: 'Completed',
      householdId: 'HH-2024-1045',
      head: 'Rekha Devi',
      risk: 12,
      issue: null,
    },
    {
      id: 28,
      x: '35%',
      y: '78%',
      color: '#F59E0B',
      status: 'In-progress',
      householdId: 'HH-2024-1046',
      head: 'Ajay Mishra',
      risk: 48,
      issue: 'Survey ongoing',
    },
    {
      id: 29,
      x: '45%',
      y: '85%',
      color: '#9333EA',
      status: 'Flagged',
      householdId: 'HH-2024-1047',
      head: 'Kavita Sharma',
      risk: 82,
      issue: 'Duplicate Aadhaar',
    },
    {
      id: 30,
      x: '58%',
      y: '82%',
      color: '#2E7D32',
      status: 'Completed',
      householdId: 'HH-2024-1048',
      head: 'Manoj Jain',
      risk: 19,
      issue: null,
    },
    {
      id: 31,
      x: '68%',
      y: '78%',
      color: '#DC2626',
      status: 'Pending',
      householdId: 'HH-2024-1049',
      head: 'Alok Verma',
      risk: 72,
      issue: 'Verification pending',
    },
    {
      id: 32,
      x: '78%',
      y: '85%',
      color: '#F59E0B',
      status: 'In-progress',
      householdId: 'HH-2024-1050',
      head: 'Sneha Kulkarni',
      risk: 55,
      issue: 'Survey ongoing',
    },
  ];

  const [region, setRegion] = useState(userDetails?.district?.name);
  const [ward, setWard] = useState('Ward 12');
  const [risk, setRisk] = useState('All Risk Levels');
  const [selectedMarker, setSelectedMarker] = useState(markers[1]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [filteredWards, setFilteredWards] = useState<any[]>([]);

  useEffect(() => {
    if (IsFocused) {
      const fetchFilterOptions = async () => {
        try {
          const action: any = await dispatch(GetGeofiltersOptionsApi());
          const res = action?.payload?.data;

          console.log('API DATA ===>', res);

          setDistricts(res?.districts || []);
          setWards(res?.wards || []);

          // default selection
          if (res?.districts?.length > 0) {
            const firstDistrict = res.districts[0];
            setRegion(firstDistrict.name);

            const wardList = res.wards.filter(
              (w: any) => w.district_id === firstDistrict.id,
            );

            setFilteredWards(wardList);
            setWard(wardList?.[0]?.name || '');
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchFilterOptions();
    }
  }, [IsFocused]);

  const filteredMarkers = markers.filter(m => {
    // Risk filter
    if (risk === 'High Risk' && m.risk < 70) return false;

    // Status filter (if needed)
    if (risk === 'Completed' && m.status !== 'Completed') return false;

    return true;
  });

  const counts = {
    completed: markers.filter(m => m.status === 'Completed').length,
    pending: markers.filter(m => m.status === 'Pending').length,
    inProgress: markers.filter(m => m.status === 'In-progress').length,
    flagged: markers.filter(m => m.status === 'Flagged').length,
  };

  const handleDistrictChange = (selectedName: string) => {
    setRegion(selectedName);

    const selectedDistrict = districts.find(d => d.name === selectedName);

    if (selectedDistrict) {
      const wardList = wards.filter(w => w.district_id === selectedDistrict.id);

      setFilteredWards(wardList);
      setWard(wardList?.[0]?.name || '');
    }
  };
  const CommonDropDown = ({
    value,
    options,
    type,
    openDropdown,
    setOpenDropdown,
    onSelect,
  }: any) => {
    const isOpen = openDropdown === type;

    return (
      <View
        style={[
          styles.dropdownWrapper,
          isOpen && { zIndex: 9999, elevation: 10 },
        ]}
      >
        {/* BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.dropdown}
          onPress={() => setOpenDropdown(isOpen ? null : type)}
        >
          <Text numberOfLines={1} style={styles.dropdownText}>
            {value}
          </Text>
          <AppIcon type="AntDesign" name={'down'} size={14} />
        </TouchableOpacity>

        {/* LIST */}
        {isOpen && (
          <View style={styles.dropdownList}>
            {options.map((item: string, index: number) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.dropdownItemRow,
                  index === options.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => {
                  onSelect(item);
                  setOpenDropdown(null);
                }}
              >
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="default" />
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <AppIcon type="Ionicons" name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>🗺️ Geo-tagged Household Map</Text>
          <Text style={styles.headerSubtitle}>
            Ward 12, Saket · 48 Households
          </Text>
        </View>
        <TouchableOpacity
          style={styles.clusterBtn}
          onPress={() => {
            showToast('Cluster View activated');
          }}
        >
          <Text style={styles.clusterBtnText}>Cluster View</Text>
        </TouchableOpacity>
      </View>

      {/* FILTER BAR */}
      <View style={styles.filterBar}>
        <CommonDropDown
          type="region"
          value={region}
          options={districts.map(d => d.name)}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={handleDistrictChange}
        />

        <CommonDropDown
          type="ward"
          value={ward}
          options={filteredWards.map(w => w.name)}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={setWard}
        />

        <CommonDropDown
          type="risk"
          value={risk}
          options={['All Risk Levels', 'High Risk', 'Completed']}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          onSelect={setRisk}
        />

        <View style={styles.legendContainer}>
          <Text
            style={[
              styles.legend,
              { color: '#10B981', backgroundColor: '#ECFDF5' },
            ]}
          >
            ● Completed ({counts.completed})
          </Text>

          <Text
            style={[
              styles.legend,
              { color: '#EF4444', backgroundColor: '#FEF2F2' },
            ]}
          >
            ● Pending ({counts.pending})
          </Text>

          <Text
            style={[
              styles.legend,
              { color: '#F59E0B', backgroundColor: '#FFFBEB' },
            ]}
          >
            ● In-progress ({counts.inProgress})
          </Text>

          <Text
            style={[
              styles.legend,
              { color: '#8B5CF6', backgroundColor: '#F5F3FF' },
            ]}
          >
            ● Flagged ({counts.flagged})
          </Text>
        </View>
      </View>

      <View style={styles.mainWrapper}>
        {/* MAP AREA */}
        <View style={styles.mapFrame}>
          <View style={styles.gridOverlay}>
            {/* Horizontal Grid Lines */}
            {[...Array(10)].map((_, i) => (
              <View
                key={`h-${i}`}
                style={[styles.gridLineH, { top: `${i * 10}%` }]}
              />
            ))}
            {/* Vertical Grid Lines */}
            {[...Array(15)].map((_, i) => (
              <View
                key={`v-${i}`}
                style={[styles.gridLineV, { left: `${i * 6.6}%` }]}
              />
            ))}

            {/* Map Markers */}
            {filteredMarkers.map(m => {
              const dynamicMarkerStyle: ViewStyle = {
                left: m.x as any,
                top: m.y as any,
                backgroundColor: m.color,
              };

              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setSelectedMarker(m)}
                  style={[
                    styles.dot,
                    dynamicMarkerStyle,
                    selectedMarker?.id === m.id && styles.dotActive,
                  ]}
                />
              );
            })}

            <View style={styles.scaleContainer}>
              <Text style={styles.scaleText}>Scale 1:2500</Text>
            </View>
          </View>
        </View>

        {/* SIDEBAR */}
        <View style={styles.sidebar}>
          {/* Household Card */}
          <View style={styles.cardFlagged}>
            <Text style={styles.cardId}>
              ● {selectedMarker.householdId} · {selectedMarker.status}
            </Text>

            <View style={styles.cardContent}>
              <Text style={styles.infoLabel}>
                Head:<Text style={styles.infoValue}>{selectedMarker.head}</Text>
              </Text>

              <Text style={styles.infoLabel}>
                Status:
                <Text style={styles.infoValue}>{selectedMarker.status}</Text>
              </Text>

              <Text style={styles.infoLabel}>
                Risk:
                <Text style={styles.riskValue}>
                  {selectedMarker.risk >= 70 ? 'High' : 'Medium'} (
                  {selectedMarker.risk}/100)
                </Text>
              </Text>
            </View>

            {selectedMarker.issue && (
              <View style={styles.alertBox}>
                <Text style={styles.alertText}>⚠️ {selectedMarker.issue}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.viewDetailsBtn}
              onPress={() => navigation.navigate('Verification')}
            >
              <Text style={styles.viewDetailsText}>View Details →</Text>
            </TouchableOpacity>
          </View>

          {/* Stat Box: Completion */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>COMPLETION</Text>
            <Text style={styles.statValue}>64.5%</Text>
          </View>

          {/* Stat Box: High Risk */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>HIGH RISK</Text>
            <Text style={[styles.statValue, { color: '#DC2626' }]}>2</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    // borderRadius: 20,
    paddingHorizontal: 15,
  },
  backBtn: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitleContainer: { flex: 1 },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  headerSubtitle: { color: '#94A3B8', fontSize: 12 },
  clusterBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clusterBtnText: { color: '#0F172A', fontWeight: 'bold' },

  filterBar: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  dropdown: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendContainer: { flexDirection: 'row', marginLeft: 'auto' },
  legend: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  mainWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // --- MAP ---
  mapFrame: {
    flex: 0.72,
    backgroundColor: '#D6E4F0',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  gridOverlay: { flex: 1, position: 'relative' },
  gridLineH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  gridLineV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  dotActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    transform: [{ scale: 1.2 }],
  },
  scaleContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scaleText: { fontSize: 10, color: '#64748B', fontWeight: 'bold' },

  // --- SIDEBAR ---
  sidebar: { flex: 0.28, marginLeft: 20 },
  cardFlagged: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    marginBottom: 15,
  },
  cardId: {
    color: '#8B5CF6',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
  cardContent: { gap: 4 },
  infoLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  infoValue: { color: '#1E293B', fontWeight: 'bold' },
  riskValue: { color: '#DC2626', fontWeight: 'bold' },
  alertBox: { marginVertical: 12 },
  alertText: { color: '#DC2626', fontSize: 12, fontWeight: 'bold' },
  viewDetailsBtn: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewDetailsText: { color: '#1E293B', fontWeight: 'bold' },

  statBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 15,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 5,
  },
  dropdownWrapper: {
    width: 140,
    marginRight: 10,
  },

  dropdownText: {
    fontSize: 13,
    fontFamily: FONTS.SemiBold,
    color: '#0F172A',
    flex: 1,
  },

  arrow: {
    fontSize: 12,
    color: '#64748B',
  },

  dropdownList: {
    position: 'absolute',
    top: 45,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },

  dropdownItemRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  dropdownItem: {
    fontSize: 13,
    color: '#334155',
    fontFamily: FONTS.SemiBold,
  },
});

export default MapScreen;
