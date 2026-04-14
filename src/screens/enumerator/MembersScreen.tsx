import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import AppIcon from '../../components/common/AppIcon';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CreateHouseholdApi } from '../../store/slices/commonSlice';
import { useAppDispatch } from '../../store/hooks';

const MembersScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const { data } = route.params || {};
  const createInitialMember = (data: any) => {
    if (!data) return [];

    return [
      {
        id: Date.now(),
        name: data.headName || '',
        age: data.age || '', // if available
        gender: data.gender || '',
        relation: data.relationship || 'Head',
        education: data.education || '',
        status: 'Verified',
        aadhaar_raw: data.aadhaar || '',
        initials: (data.headName || '')
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase(),
        color: '#E0F2FE',
        textColor: '#075985',
      },
    ];
  };
  const [members, setMembers] = useState<any[]>(() =>
    createInitialMember(data),
  );

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    relation: '',
    education: '',
  });

  const RELATION_OPTIONS = ['Son', 'Daughter', 'Spouse', 'Parent'];
  const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
  const EDUCATION_OPTIONS = ['Primary', 'Secondary', 'Graduate'];
  const [showRelationModal, setShowRelationModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleSave = async () => {
    const payload = {
      head_name: data.headName,
      mobile: data.mobile,
      address: data.address,
      state_id: data.state.id,
      district_id: data.district.id,
      latitude: data.latitude || '23.0537',
      longitude: data.longitude || '72.5189',
      aadhaar_number_raw: data.aadhaar,
      aadhaar_consent: data.aadhaar_consent,
      aadhaar_verified: data.aadhaar_verified,

      members: members
        .filter(m => m.relation !== 'head')
        .map(m => ({
          name: m.name,
          age: m.age,
          gender: m.gender?.toLowerCase(),
          relationship: m.relation?.toLowerCase(),
          education: m.education,
          aadhaar_raw: m.aadhaar_raw || '',
          aadhaar_verified: m.status === 'Verified',
          verification_status: m.status === 'Verified' ? 'verified' : 'pending',
        })),
    };

    const result = await dispatch(CreateHouseholdApi(payload)).unwrap();
    if (result.status === 'success') {
      navigation.navigate('Survey');
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors((prev: any) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    let temp: any = {};
    let isValid = true;

    if (!form.name.trim()) {
      temp.name = 'Name required';
      isValid = false;
    }

    if (!form.age) {
      temp.age = 'Age required';
      isValid = false;
    } else if (isNaN(Number(form.age)) || Number(form.age) <= 0) {
      temp.age = 'Invalid age';
      isValid = false;
    }

    if (!form.gender) {
      temp.gender = 'Gender required';
      isValid = false;
    }

    if (!form.relation) {
      temp.relation = 'Relation required';
      isValid = false;
    }

    setErrors(temp);
    return isValid;
  };

  const handleAddMember = () => {
    if (!validate()) return;

    const isEditing = editingMemberId !== null;

    const memberData = {
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      relation: form.relation,
      education: form.education,
      initials: form.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase(),
      color: '#E0F2FE',
      textColor: '#075985',
    };

    if (isEditing) {
      setMembers(prev =>
        prev.map(m =>
          m.id === editingMemberId
            ? {
                ...m,
                ...memberData,

                // ✅ IMPORTANT: preserve old status
                status: m.status,

                id: editingMemberId,
              }
            : m,
        ),
      );

      setEditingMemberId(null);
    } else {
      setMembers(prev => [
        ...prev,
        {
          ...memberData,
          id: Date.now(),
          status: 'Pending', // only new members are pending
        },
      ]);
    }

    setForm({
      name: '',
      age: '',
      gender: '',
      relation: '',
      education: '',
    });
  };

  const handleEditMember = (member: any) => {
    setForm({
      name: member.name,
      age: String(member.age),
      gender: member.gender,
      relation: member.relation,
      education: member.education,
    });

    setEditingMemberId(member.id);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Dark Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={() => navigation.goBack()}
        >
          <AppIcon type="Ionicons" name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <View style={styles.headerTitleRow}>
            <AppIcon
              type="Ionicons"
              name="people"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.headerTitle}>Add Members</Text>
          </View>
          <Text style={styles.headerSub}>
            HH-2024-DL-S12-1107 • Mohan Lal Sharma
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>4 Members</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Family Members List Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>FAMILY MEMBERS</Text>
            <TouchableOpacity style={styles.addMemberBtn}>
              <Text style={styles.addMemberBtnText}>+ Add Member</Text>
            </TouchableOpacity>
          </View>

          {members.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.memberItem,
                index === members.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.avatar, { backgroundColor: item.color }]}>
                <Text style={[styles.avatarText, { color: item.textColor }]}>
                  {item.initials}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberSub}>
                  Age {item.age} • {item.gender} • {item.relation}
                </Text>
              </View>
              <View style={styles.memberActions}>
                {item.status === 'Verified' ? (
                  <View style={styles.verifiedTag}>
                    <AppIcon
                      type="Ionicons"
                      name="checkmark"
                      size={12}
                      color="#059669"
                    />
                    <Text style={styles.verifiedTagText}>Verified</Text>
                  </View>
                ) : (
                  <View style={styles.pendingTag}>
                    <Text style={{ fontSize: 12 }}>⌛ Pending</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.actionBtn}>
                  <Text
                    style={styles.actionBtnText}
                    onPress={() => {
                      if (item.status === 'Verified') {
                        handleEditMember(item);
                      } else {
                        navigation.navigate('Verification');
                      }
                    }}
                  >
                    {item.status === 'Verified' ? 'Edit' : 'Verify →'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add New Member Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {editingMemberId !== null ? 'UPDATE MEMBER' : 'ADD NEW MEMBER'}
          </Text>
          <View style={styles.formGrid}>
            <View style={{ flex: 2 }}>
              <FormInput
                label="Full Name *"
                placeholder="As per Aadhaar / ID"
                value={form.name}
                editable={form.relation !== 'head'}
                onChangeText={(val: string) => handleChange('name', val)}
                error={errors.name}
              />
            </View>
            <View style={{ flex: 1.5 }}>
              <Text style={styles.inputLabel}>{'Relationship *'}</Text>
              <TouchableOpacity
                style={[
                  styles.inputField,
                  form.relation === 'head' && { opacity: 0.6 },
                ]}
                onPress={() => {
                  if (form.relation === 'head') return;
                  setShowRelationModal(true);
                }}
                disabled={form.relation === 'head'}
              >
                <Text style={styles.inputText}>
                  {form.relation || 'Select Relationship'}
                </Text>
              </TouchableOpacity>

              {errors.relation && (
                <Text style={{ color: 'red', fontSize: 11 }}>
                  {errors.relation}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.formGrid}>
            <View style={{ flex: 1 }}>
              <FormInput
                label="Age *"
                placeholder="Years"
                value={form.age}
                onChangeText={(val: string) => handleChange('age', val)}
                error={errors.age}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>{'Gender *'}</Text>
              <TouchableOpacity
                style={styles.inputField}
                onPress={() => setShowGenderModal(true)}
              >
                <Text style={styles.inputText}>
                  {form.gender || 'Select Gender'}
                </Text>
              </TouchableOpacity>
              {errors.gender && (
                <Text style={{ color: 'red', fontSize: 11 }}>
                  {errors.gender}
                </Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>{'Education'}</Text>
              <TouchableOpacity
                style={styles.inputField}
                onPress={() => setShowEducationModal(true)}
              >
                <Text style={styles.inputText}>
                  {form.education || 'Select Education'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Suggestion Box */}
          <View style={styles.aiSuggestionBox}>
            <Text style={{ fontSize: 18 }}>🤖</Text>
            <Text style={styles.aiText}>
              Aadhaar-linked family tree suggests 1 more member.{' '}
              <Text style={styles.aiLink}>Tap to autofill →</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.addThisBtn} onPress={handleAddMember}>
            <Text style={styles.addThisBtnText}>
              {editingMemberId !== null ? 'Update Member' : '+ Add This Member'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showRelationModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Relationship</Text>

            <ScrollView>
              {RELATION_OPTIONS.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange('relation', item);
                    setShowRelationModal(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={() => setShowRelationModal(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showGenderModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Gender</Text>

            <ScrollView>
              {GENDER_OPTIONS.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange('gender', item);
                    setShowGenderModal(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={() => setShowGenderModal(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showEducationModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Education</Text>

            <ScrollView>
              {EDUCATION_OPTIONS.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange('education', item);
                    setShowEducationModal(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={() => setShowEducationModal(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.footerBack}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNext} onPress={handleSave}>
          <Text style={styles.footerNextText}>Save & Continue →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FormInput = ({
  label,
  editable = true,
  placeholder,
  value,
  onChangeText,
  isDropdown,
  error,
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>

    <View style={[styles.inputField, !editable && { opacity: 0.6 }]}>
      <TextInput
        placeholder={placeholder}
        editable={editable}
        value={value}
        maxLength={30}
        onChangeText={onChangeText}
        style={styles.inputText}
        placeholderTextColor="#94A3B8"
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
  mainContainer: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    backgroundColor: '#0F172A',
    padding: 20,
    paddingTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    marginLeft: 'auto',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countBadgeText: { color: '#1E40AF', fontWeight: 'bold', fontSize: 12 },

  scrollContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 12,
    paddingBottom: 20,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },

  addMemberBtn: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addMemberBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  // Member List Styles
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontWeight: 'bold', fontSize: 14 },
  memberInfo: { flex: 1, marginLeft: 12 },
  memberName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  memberSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  memberActions: { flexDirection: 'row', alignItems: 'center' },

  verifiedTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  verifiedTagText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  pendingTag: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },

  actionBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnText: { fontSize: 12, fontWeight: 'bold', color: '#1E293B' },

  // Form Styles
  formGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputGroup: { marginBottom: 8 },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  inputText: { flex: 1, color: '#1E293B', fontSize: 14 },

  aiSuggestionBox: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  aiText: { flex: 1, marginLeft: 10, color: '#1E40AF', fontSize: 13 },
  aiLink: { fontWeight: 'bold', textDecorationLine: 'underline' },

  addThisBtn: {
    backgroundColor: '#1E3A8A',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  addThisBtnText: { color: '#fff', fontWeight: 'bold' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerBack: { color: '#1E293B', fontWeight: 'bold' },
  footerNext: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
    flex: 0.8,
    alignItems: 'center',
  },
  footerNextText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    maxHeight: '60%',
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  closeText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default MembersScreen;
