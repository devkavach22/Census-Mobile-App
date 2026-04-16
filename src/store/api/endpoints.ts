export const ENDPOINTS = {
  // AUTH APIs
  LOGIN_SEND_OTP: '/api/auth/send_otp',
  LOGIN_VERIFY_OTP: '/api/auth/verify_otp',
  LOGIN_WITH_PASSWORD: '/api/auth/login_password',
  LOGIN_WITH_AADHAAR: '/api/auth/verify_aadhaar',
  FORGOT_PASSWORD: '/api/auth/forgot_password',
  RESET_PASSWORD: '/api/auth/reset_password_confirm',

  // DASHBOARD APIs
  DASHBOARD_STATES: '/api/census/dashboard_stats',
  NOTIFICATIONS: '/api/census/notifications',
  GEO_DATA: '/api/census/geo_data',

  // HOUSEHOLD APIs
  CREATE_HOUSEHOLD: '/api/census/create_household',

  // MEMBER APIs
  CREATE_MEMBER: '/api/census/member/create',
  UPDATE_MEMBER: '/api/census/member/update',
  DELETE_MEMBER: '/api/census/member/delete',
  GET_MEMBER: '/api/census/member/get',

  // SURVEY APIs
  SUBMIT_SURVEY: '/api/survey/submit',
  SAVE_DRAFT: '/api/survey/save_draft',
  GET_QUESTIONS: '/api/survey/questions',

  // MASTER APIs
  GET_STATES: '/api/master/states',
  GET_DISTRICTS: '/api/master/districts',
  GET_VILLAGE_WARDS: '/api/master/village_wards?district_id',

  // PROFILE APIs
  GET_PROFILE: '/api/profile/get',
  UPDATE_PROFILE: '/api/profile/update',

  //filters Apis
  GEO_FILTER_OPTIONS: '/api/census/geo_filter_options',

  //servey Apis
  GET_SURVEY_QUESTIONS: '/api/survey/questions?survey_id=',
  SURVEY_SUBMIT: '/api/survey/submit',
};
