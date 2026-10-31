/**
 * 對應 Firebase Identity Toolkit REST API 的錯誤代碼。
 * server 端只會回傳代碼，訊息在前端轉換，避免洩漏後端細節。
 */
export const errorMessages: { [key: string]: string } = {
    EMAIL_NOT_FOUND: "Account doesn't exist",
    INVALID_PASSWORD: "Wrong Password",
    INVALID_LOGIN_CREDENTIALS: "Account doesn't exist",
    INVALID_EMAIL: "Account doesn't exist",
    EMAIL_EXISTS: "That Email is taken. Try another.",
    WEAK_PASSWORD: "密碼至少需 6 個字元",
    TOO_MANY_ATTEMPTS_TRY_LATER: "嘗試次數過多，請稍後再試",
    USER_DISABLED: "此帳號已被停用",
};
