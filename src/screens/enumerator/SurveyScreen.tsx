import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AppIcon from '../../components/common/AppIcon';
import { useNavigation } from '@react-navigation/native';

const SummaryScreen = () => {
  const navigation = useNavigation<any>();

  const totalSections = 7;

  const [currentStep, setCurrentStep] = useState(2);

  const handleNextSection = () => {
    if (currentStep < totalSections - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigation.navigate('EnumeratorDashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={handlePrevious}>
          <AppIcon type="Ionicons" name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <View style={styles.headerTitleRow}>
            <AppIcon
              type="Ionicons"
              name="clipboard-outline"
              size={20}
              color="#fff"
            />
            <Text style={styles.headerTitle}> Census Survey Form</Text>
          </View>
          <Text style={styles.headerSub}>
            HH-2024-DL-S12-1107 • Housing Section
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>
              Step {currentStep + 1} of {totalSections}
            </Text>
          </View>
          <TouchableOpacity style={styles.draftBtn}>
            <AppIcon type="Ionicons" name="save" size={18} color="#1E293B" />
            <Text style={styles.draftBtnText}>Draft</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section Header & Dynamic Progress Bar */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Section: Housing Conditions</Text>
            <Text style={styles.sectionCount}>
              {currentStep + 1} / {totalSections} sections
            </Text>
          </View>

          <View style={styles.progressContainer}>
            {[...Array(totalSections)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  index <= currentStep && styles.segmentActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.gridRow}>
          {/* Q1 Card */}
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.qNum}>Q1 of 12</Text>
            <Text style={styles.qText}>Type of dwelling unit?</Text>

            <TouchableOpacity style={[styles.option, styles.optionSelected]}>
              <AppIcon
                type="Ionicons"
                name="radio-button-on"
                size={18}
                color="#2563EB"
              />
              <Text style={styles.optionText}>Permanent (Pucca)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
              <AppIcon
                type="Ionicons"
                name="radio-button-off"
                size={18}
                color="#94A3B8"
              />
              <Text style={styles.optionText}>Semi-permanent</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
              <AppIcon
                type="Ionicons"
                name="radio-button-off"
                size={18}
                color="#94A3B8"
              />
              <Text style={styles.optionText}>Temporary (Kutcha)</Text>
            </TouchableOpacity>
          </View>

          {/* Q2 Card */}
          <View style={[styles.card, { flex: 1, marginLeft: 16 }]}>
            <Text style={styles.qNum}>Q2 of 12</Text>
            <Text style={styles.qText}>Rooms in house?</Text>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownValue}>2 rooms</Text>
              <AppIcon
                type="Ionicons"
                name="chevron-down"
                size={20}
                color="#1E293B"
              />
            </View>

            <View style={{ marginTop: 24 }}>
              <Text style={styles.qNum}>Q4 of 12</Text>
              <Text style={styles.qText}>Primary income source?</Text>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyValue}>Salaried (Government)</Text>
              </View>

              <View style={styles.aiBox}>
                <Text style={{ fontSize: 16 }}>🤖</Text>
                <Text style={styles.aiText}>
                  AI: Answers consistent. Review Q7 before submit.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Q3 Card */}
        <View style={[styles.card, { width: '49%' }]}>
          <Text style={styles.qNum}>Q3 of 12</Text>
          <Text style={styles.qText}>Access to piped water?</Text>
          <View style={styles.binaryRow}>
            <TouchableOpacity style={[styles.binaryBtn, styles.binaryYes]}>
              <AppIcon
                type="Ionicons"
                name="checkmark"
                size={18}
                color="#15803D"
              />
              <Text style={styles.binaryYesText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.binaryBtn, styles.binaryNo]}>
              <AppIcon type="Ionicons" name="close" size={18} color="#1E293B" />
              <Text style={styles.binaryNoText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.prevBtn} onPress={handlePrevious}>
          <AppIcon
            type="Ionicons"
            name="arrow-back"
            size={18}
            color="#1E293B"
          />
          <Text style={styles.prevBtnText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextSectionBtn}
          onPress={handleNextSection}
        >
          <Text style={styles.nextSectionText}>
            {currentStep === totalSections - 1
              ? 'Finish Survey'
              : 'Next Section →'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitBtn,
            currentStep < totalSections - 1 && { opacity: 0.6 },
          ]}
          onPress={() => navigation.navigate('EnumeratorDashboard')}
        >
          <Text style={styles.submitBtnText}>Submit Survey</Text>
          <AppIcon
            type="Ionicons"
            name="checkmark-done"
            size={18}
            color="#15803D"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    backgroundColor: '#0F172A',
    padding: 16,
    paddingTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#94A3B8', fontSize: 12 },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  stepBadgeText: { color: '#1E40AF', fontWeight: 'bold', fontSize: 12 },
  draftBtn: {
    backgroundColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  draftBtnText: { color: '#1E293B', fontWeight: 'bold', marginLeft: 6 },

  scrollContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: { fontWeight: 'bold', color: '#1E293B' },
  sectionCount: { color: '#64748B', fontSize: 12 },
  progressContainer: { flexDirection: 'row', gap: 6, height: 6 },
  progressSegment: { flex: 1, backgroundColor: '#E2E8F0', borderRadius: 4 },
  segmentActive: { backgroundColor: '#2563EB' },

  gridRow: { flexDirection: 'row' },
  qNum: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  qText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
    marginBottom: 16,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionSelected: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  optionText: { marginLeft: 12, color: '#1E293B', fontWeight: '500' },

  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    borderRadius: 8,
  },
  dropdownValue: { color: '#1E293B' },

  readOnlyInput: { backgroundColor: '#F1F5F9', padding: 14, borderRadius: 8 },
  readOnlyValue: { color: '#1E293B', fontWeight: '500' },

  aiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  aiText: { marginLeft: 8, color: '#1E40AF', fontSize: 12, fontWeight: '500' },

  binaryRow: { flexDirection: 'row', gap: 12 },
  binaryBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  binaryYes: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
  binaryYesText: { marginLeft: 8, color: '#15803D', fontWeight: 'bold' },
  binaryNo: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
  binaryNoText: { marginLeft: 8, color: '#1E293B', fontWeight: 'bold' },

  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  prevBtn: { flexDirection: 'row', alignItems: 'center' },
  prevBtnText: { marginLeft: 8, fontWeight: 'bold', color: '#1E293B' },
  nextSectionBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextSectionText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  submitBtn: {
    backgroundColor: '#DCFCE7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitBtnText: { color: '#15803D', fontWeight: 'bold', marginRight: 8 },
});

export default SummaryScreen;
