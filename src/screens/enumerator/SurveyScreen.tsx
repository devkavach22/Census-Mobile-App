import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIcon from '../../components/common/AppIcon';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store/hooks';
import {
  GetSurveyQuestionsApi,
  SurveySubmitApi,
} from '../../store/slices/commonSlice';
import { FONTS } from '../../theme/fonts';
import { useSelector } from 'react-redux';
import { showToast } from '../../components/common/showToast';
import {
  getStorageData,
  removeStorageData,
  STORAGE_KEYS,
} from '../../utils/storage';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const SummaryScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const [pages, setPages] = useState<any[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const surveyId = 6;
  const { SurveryQuestionData } = useSelector((state: any) => state.common);
  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    if (isFocused) {
      dispatch(GetSurveyQuestionsApi({ id: surveyId }));
    }
  }, [isFocused]);

  useEffect(() => {
    if (SurveryQuestionData?.pages) {
      setPages(SurveryQuestionData.pages);
    }

    loadDraftAnswers();
  }, [SurveryQuestionData]);

  const flattenAnswers = (obj: any) => {
    let result: any = {};

    const process = (data: any) => {
      Object.keys(data).forEach(key => {
        if ((key as any) === 'answers') {
          process(data[key]); // recursive flatten
        } else if (key !== 'currentPageIndex') {
          result[key] = data[key];
        }
      });
    };

    process(obj);

    return result;
  };

  const handleSurveySubmit = async () => {
    try {
      const result = await getStorageData(STORAGE_KEYS.HOUSE_HOLD_DATA);
      const flatAnswers = flattenAnswers(answers);
      const answersArray = Object.keys(flatAnswers).map(questionId => {
        const ans = flatAnswers[questionId];

        return {
          question_id: Number(questionId),
          ...(ans.answer_text && {
            answer_text: ans.answer_text,
          }),
          ...(ans.option_id && {
            option_id: ans.option_id,
          }),
        };
      });

      const payload = {
        survey_id: surveyId,
        household_id: result.HHID,
        answers: answersArray,
      };

      const response = await dispatch(SurveySubmitApi(payload));
      if (response?.payload?.status === 'success') {
        await removeStorageData(STORAGE_KEYS.HOUSE_HOLD_DATA);
        navigation.navigate('EnumeratorDashboard');
        console.log('Storage Cleared Successfully');
      }
    } catch (error) {
      console.log('Submit Error =====>', error);
    }
  };

  const loadDraftAnswers = async () => {
    try {
      const draft = await AsyncStorage.getItem('survey_draft');
      if (draft) {
        setAnswers(JSON.parse(draft));
      }
    } catch (e) {
      console.log('Draft Load Error:', e);
    }
  };
  /* ---------------- GLOBAL QUESTION NUMBER ---------------- */

  const getGlobalQuestionNumber = (index: number) => {
    let count = 0;

    for (let i = 0; i < currentPageIndex; i++) {
      count += pages[i]?.questions?.length || 0;
    }

    return count + index + 1;
  };

  /* ---------------- TOTAL QUESTIONS ---------------- */

  const getTotalQuestions = () => {
    return pages.reduce((sum, page) => sum + (page?.questions?.length || 0), 0);
  };

  /* ---------------- ANSWERS ---------------- */

  const handleAnswer = (questionId: number, value: any, optionId?: number) => {
    setAnswers((prev: any) => ({
      ...prev,
      [questionId]: optionId ? { option_id: optionId } : { answer_text: value },
    }));
  };

  /* ---------------- PAGE VALIDATION ---------------- */

  const validateCurrentPage = () => {
    const currentPage = pages[currentPageIndex];

    if (!currentPage?.questions) return true;

    for (let q of currentPage.questions) {
      const answer = answers[q.id];

      /* Required Check */

      if (!answer) {
        showToast(`Please answer: ${q.title}`, 'danger');

        return false;
      }

      /* Text Validation */

      if (
        q.type === 'text_box' ||
        q.type === 'char_box' ||
        q.type === 'numerical_box'
      ) {
        if (!answer.answer_text || answer.answer_text.trim() === '') {
          showToast(`Please fill: ${q.title}`, 'danger');

          return false;
        }

        /* Mobile Validation Example */

        if (
          q.title.toLowerCase().includes('mobile') &&
          !/^[0-9]{10}$/.test(answer.answer_text)
        ) {
          showToast('Please enter a valid 10-digit mobile number', 'danger');

          return false;
        }
      }

      /* Radio Validation */

      if (q.type === 'simple_choice') {
        if (!answer.option_id) {
          showToast(`Please select option for: ${q.title}`, 'danger');

          return false;
        }
      }

      /* Yes No Validation */

      if (q.type === 'yes_no') {
        if (!answer.answer_text) {
          showToast(`Please select Yes or No for: ${q.title}`, 'danger');
          return false;
        }
      }
    }

    return true;
  };

  /* ---------------- QUESTION UI ---------------- */

  const renderQuestion = (q: any, index: number) => {
    const globalIndex = getGlobalQuestionNumber(index);

    const totalQuestions = getTotalQuestions();

    /* TEXT */

    if (
      q.type === 'text_box' ||
      q.type === 'char_box' ||
      q.type === 'numerical_box'
    ) {
      return (
        <View key={q.id} style={styles.card}>
          <Text style={styles.qNum}>
            Question {globalIndex} of {totalQuestions}
          </Text>

          <Text style={styles.qTitle}>{q.title}</Text>

          <TextInput
            style={styles.input}
            value={answers[q.id]?.answer_text || ''}
            keyboardType={q.type === 'numerical_box' ? 'numeric' : 'default'}
            placeholder="Type your answer..."
            onChangeText={text => handleAnswer(q.id, text)}
          />
        </View>
      );
    }

    /* RADIO */

    if (q.type === 'simple_choice') {
      return (
        <View key={q.id} style={styles.card}>
          <Text style={styles.qNum}>
            Question {globalIndex} of {totalQuestions}
          </Text>

          <Text style={styles.qTitle}>{q.title}</Text>

          {q.options.map((opt: any) => {
            const selected = answers[q.id]?.option_id === opt.id;

            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.optionCard, selected && styles.optionCardActive]}
                onPress={() => handleAnswer(q.id, opt.text, opt.id)}
              >
                <View
                  style={[styles.radioCircle, selected && styles.radioFilled]}
                />

                <Text style={styles.optionText}>{opt.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    /* YES NO */

    if (q.type === 'yes_no') {
      return (
        <View key={q.id} style={styles.card}>
          <Text style={styles.qNum}>
            Question {globalIndex} of {totalQuestions}
          </Text>

          <Text style={styles.qTitle}>{q.title}</Text>

          <View style={styles.yesNoRow}>
            <TouchableOpacity
              style={[
                styles.yesBtn,
                answers[q.id]?.answer_text === 'Yes' && styles.yesActive,
              ]}
              onPress={() => handleAnswer(q.id, 'Yes')}
            >
              <AppIcon type="Feather" name="check" size={16} color="#16A34A" />

              <Text style={styles.yesText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.noBtn,
                answers[q.id]?.answer_text === 'No' && styles.noActive,
              ]}
              onPress={() => handleAnswer(q.id, 'No')}
            >
              <AppIcon type="Feather" name="x" size={16} color="#DC2626" />

              <Text style={styles.noText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  };

  /* ---------------- NAV ---------------- */

  const handleNext = () => {
    const isValid = validateCurrentPage();

    if (!isValid) return;

    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(p => p + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(p => p - 1);
  };

  const saveDraft = async () => {
    const isValid = validateCurrentPage();

    if (!isValid) return;

    try {
      await AsyncStorage.setItem(
        'survey_draft',
        JSON.stringify({
          answers,
          currentPageIndex,
        }),
      );

      showToast('Draft Saved Successfully', 'success');
    } catch (e) {
      showToast('Draft Save Failed', 'danger');
    }
  };
  const currentPage = pages[currentPageIndex];

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppIcon type="Ionicons" name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Census Survey</Text>

        <TouchableOpacity style={styles.draftBtn} onPress={saveDraft}>
          <Text style={{ fontWeight: '600' }}>Draft</Text>
        </TouchableOpacity>
      </View>

      {/* SECTION */}

      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>{currentPage?.title}</Text>

        <View style={styles.sectionProgressRow}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.sectionBar,
                i <= currentPageIndex && styles.sectionBarActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* QUESTIONS */}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={isTablet ? styles.grid : undefined}>
          {currentPage?.questions.map((q: any, i: number) =>
            renderQuestion(q, i),
          )}
        </View>
      </ScrollView>

      {/* FOOTER */}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.prevBtn} onPress={handlePrevious}>
          <Text style={styles.prevText}>← Previous</Text>
        </TouchableOpacity>

        {currentPageIndex < pages.length - 1 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>Next Section →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSurveySubmit}
          >
            <Text style={styles.submitText}>Submit Survey ✓</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SummaryScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  header: {
    paddingTop: 40,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONTS.Bold,
  },

  draftBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontFamily: FONTS.Bold,
  },

  sectionBox: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 14,
    elevation: 2,
  },

  sectionTitle: {
    fontFamily: FONTS.Bold,
    marginBottom: 10,
  },

  sectionProgressRow: {
    flexDirection: 'row',
  },

  sectionBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    marginRight: 6,
    borderRadius: 4,
  },

  sectionBarActive: {
    backgroundColor: '#2563EB',
  },

  scroll: {
    padding: 16,
    paddingBottom: 100,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: isTablet ? '48%' : '100%',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 3,
  },

  qNum: {
    fontSize: 12,
    fontFamily: FONTS.Bold,
    color: '#64748B',
    marginBottom: 4,
  },

  qTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    marginBottom: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  optionCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },

  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2563EB',
    marginRight: 12,
  },

  radioFilled: {
    backgroundColor: '#2563EB',
  },

  optionText: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },

  yesNoRow: {
    flexDirection: 'row',
    gap: 12,
  },

  yesBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#16A34A',
    gap: 6,
  },

  noBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 6,
  },

  yesActive: {
    backgroundColor: '#DCFCE7',
  },

  noActive: {
    backgroundColor: '#F1F5F9',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },

  prevBtn: {
    padding: 14,
  },

  nextBtn: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
  },

  nextText: {
    color: '#fff',
    fontFamily: FONTS.Bold,
  },
  prevText: {
    color: '#000',
    fontFamily: FONTS.Bold,
  },
  submitBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
  },

  submitText: {
    color: '#fff',
    fontWeight: '700',
  },
  yesText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16A34A',
  },

  noText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
});
