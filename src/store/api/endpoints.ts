export const ENDPOINTS = {
    // AURH APIs
  
    LOGIN_SEND_OTP: "/api/auth/send_otp",
    LOGIN_VERIFY_OTP: "/api/auth/verify_otp",
    LOGIN_WITH_PASSWORD: "/api/auth/login_password",
    LOGIN_WITH_AADHAAR : '/api/auth/verify_aadhaar',
    FORGOT_PASSWORD: "/api/auth/forgot_password",
    RESET_PASSWORD: "/api/auth/reset_password_confirm",

    // DASHBORAD APIs
    DASHBOARD_STATES: "/api/census/dashboard_stats",
    CREATE_HOUSEHOLD: "/api/census/household/create",
    
    //member APIs
    CREATE_MEMBER: "/api/census/member/create",
    UPDATE_MEMBER: "/api/census/member/update",
    DELETE_MEMBER: "/api/census/member/delete",
    //survey APIs
    GET_MEMBER: "/api/census/member/get",
    SUBMIT_SURVEY: "/api/survey/submit"
};
