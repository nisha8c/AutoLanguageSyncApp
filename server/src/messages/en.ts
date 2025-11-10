// server/src/messages/en.ts
export const backendMessages: Record<string, string> = {
    // Authentication
    account_created: "Your account has been created successfully!",
    password_invalid: "Password must contain at least 8 characters.",
    email_sent: "We have sent you an email with a verification link.",

    // Common responses
    internal_error: "Something went wrong. Please try again later.",
    unauthorized: "You are not authorized to perform this action.",
    invalid_input: "The provided input is invalid.",

    // Email templates
    email_subject_welcome: "Welcome to our platform!",
    email_body_welcome: "Thank you for joining us. We’re glad to have you on board!",
};
