import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '../../components/common/showToast';

const MapScreen = () => {
  const navigation = useNavigation<any>();
  const markers = [
    { id: 1, x: '21%', y: '15%', color: '#2E7D32' },
    { id: 2, x: '32%', y: '20%', color: '#2E7D32' },
    { id: 3, x: '42%', y: '25%', color: '#2E7D32' },
    { id: 4, x: '26%', y: '30%', color: '#9333EA', active: true },
    { id: 5, x: '35%', y: '40%', color: '#F59E0B' },
    { id: 6, x: '16%', y: '48%', color: '#2E7D32' },
    { id: 7, x: '26%', y: '58%', color: '#2E7D32' },
    { id: 8, x: '45%', y: '55%', color: '#9333EA' },
    { id: 9, x: '38%', y: '65%', color: '#DC2626' },
    { id: 10, x: '50%', y: '75%', color: '#2E7D32' },
    { id: 11, x: '63%', y: '35%', color: '#2E7D32' },
    { id: 12, x: '53%', y: '20%', color: '#DC2626' },
    { id: 13, x: '57%', y: '50%', color: '#2E7D32' },
    { id: 14, x: '20%', y: '80%', color: '#DC2626' },
    { id: 15, x: '61%', y: '70%', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="default" />
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'white' }}>←</Text>
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
        <View style={styles.dropdown}>
          <Text>South Delhi ⌄</Text>
        </View>
        <View style={styles.dropdown}>
          <Text>Ward 12 ⌄</Text>
        </View>
        <View style={styles.dropdown}>
          <Text>All Risk Levels ⌄</Text>
        </View>

        <View style={styles.legendContainer}>
          <Text
            style={[
              styles.legend,
              { color: '#10B981', backgroundColor: '#ECFDF5' },
            ]}
          >
            ● Completed (31)
          </Text>
          <Text
            style={[
              styles.legend,
              { color: '#EF4444', backgroundColor: '#FEF2F2' },
            ]}
          >
            ● Pending (12)
          </Text>
          <Text
            style={[
              styles.legend,
              { color: '#F59E0B', backgroundColor: '#FFFBEB' },
            ]}
          >
            ● In-progress (3)
          </Text>
          <Text
            style={[
              styles.legend,
              { color: '#8B5CF6', backgroundColor: '#F5F3FF' },
            ]}
          >
            ● Flagged (2)
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
            {markers.map(m => {
              // Define the dynamic style object explicitly
              const dynamicMarkerStyle: ViewStyle = {
                left: m.x as any, // 'any' or 'DimensionValue' bypasses the strict string check
                top: m.y as any,
                backgroundColor: m.color,
              };

              return (
                <View
                  key={m.id}
                  style={[
                    styles.dot,
                    dynamicMarkerStyle,
                    m.active && styles.dotActive,
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
            <Text style={styles.cardId}>● HH-2024-1089 · Flagged</Text>
            <View style={styles.cardContent}>
              <Text style={styles.infoLabel}>
                Head: <Text style={styles.infoValue}>Suresh Mehta</Text>
              </Text>
              <Text style={styles.infoLabel}>
                Status: <Text style={styles.infoValue}>Flagged</Text>
              </Text>
              <Text style={styles.infoLabel}>
                Risk: <Text style={styles.riskValue}>High (78/100)</Text>
              </Text>
            </View>
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>
                ⚠️ Duplicate Aadhaar · GPS overlap
              </Text>
            </View>
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
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
    minWidth: 120,
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
});

export default MapScreen;
