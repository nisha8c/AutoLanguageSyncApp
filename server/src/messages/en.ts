// server/src/messages/en.ts
export const backendMessages: Record<string, string> = {
    // Authentication
    bk_account_created: "Your account has been created successfully!",
    bk_password_invalid: "Password must contain at least 8 characters.",
    bk_email_sent: "We have sent you an email with a verification link.",

    // Common responses
    bk_internal_error: "Something went wrong. Please try again later.",
    bk_unauthorized: "You are not authorized to perform this action.",
    bk_invalid_input: "The provided input is invalid.",

    // Email templates
    bk_email_subject_welcome: "Welcome to our platform! We welcome you",
    bk_email_body_welcome: "Thank you for joining us. We’re glad to have you on board!",
};
