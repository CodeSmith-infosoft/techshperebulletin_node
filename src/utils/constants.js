export const resMessage = {
    INTERNAL_SERVER_ERROR: "Oops! Something went wrong on our end. We're working on it—please refresh or try again later.!",
    SERVICE_ERROR: "Internal service failure. Operation could not be completed.",
    NO_TOKEN_PROVIDED: "Authentication token is missing. Please log in.!",
    UNAUTHORISED: "You are not authorized to perform this action.!",
    TOKEN_EXPIRED: "Your session has expired. Please log in again.!",
    TOKEN_INVALID: "Invalid authentication token. Please log in again.!",
    USER_FOUND: "An account with this email already exists!",
    USER_REGISTER: "Successfully signed up. Login to access your account!",
    USER_NOT_FOUND: "You don't have an account yet. Please sign up first!",
    GOOGLE_USER: "Your account was created using Google. Please continue by signing in with 'Sign in with Google'.",
    INCORRECT_PASSWORD: "Invalid current password. Please re-enter your password!",
    LOGIN_SUCCESS: "Hello You're logged in successfully!",
    ACCESS_DENIED: "Access Denied!",
    GET_PROFILE: "Your profile has been fetched successfully.!",
    UPDATE_PROFILE: "Your profile updated successfully.!",
    DATA_NOT_FOUND: "No data found! ",
    USER_LIST: "All users fetched successfully.",
    DEACTIVE_PROFILE: "Profile has been deactivated successfully.",
    GOOGLE_OAUTH_URL_GENERATED: 'Google OAuth URL generated successfully. Please proceed with the login process.',
    GOOGLE_AUTH_SUCCESS: 'Google authentication completed successfully',
    AUTHORIZATION_CODE_EXPIRED: 'Authorization code expired. Please try again.',
    GOOGLE_EMAIL_NOT_FOUND: "Google account does not have an email",
    PASSWORD_CHANGED: 'Password changed successfully. Please log in again to continue.',
    USER_SUBSCRIBE_SUCCESS: 'Thank you for subscribing — welcome to the community!',
    USER_ACCESS_RESTRICTED: "Access denied. Your account has been restricted by the admin. For assistance or registration, please get in touch with the admin!",

    CATEGORY_FOUND: "A category with this name already exists. Please choose a different name.",
    CATEGORY_ADD: "Category has been created successfully!",
    CATEGORY_LIST: "All category fetched successfully.",
    CATEGORY_SINGLE: "category fetched successfully!",
    CATEGORY_UPDATE: "category updated successfully!",

    TAGS_FOUND: "A tags with this name already exists. Please choose a different name.",
    TAGS_ADD: "Tags has been created successfully!",
    TAGS_LIST: "All tags fetched successfully.",
    TAGS_SINGLE: "Tags fetched successfully!",
    TAGS_UPDATE: "Tags updated successfully!",

    NEWS_ADD: "News has been published successfully!",
    NEWS_LIST: "All news fetched successfully.",
    NEWS_SINGLE: "News fetched successfully!",
    NEWS_UPDATE: "News updated successfully!",
    NEWS_DELETE: "News deleted successfully!",

    BLOG_ADD: "Blog has been created successfully!",
    BLOG_LIST: "Blog tags fetched successfully.",
    BLOG_SINGLE: "Blog fetched successfully!",
    BLOG_UPDATE: "Blog updated successfully!",
    BLOG_DELETE: "Blog deleted successfully!",

};

export const resStatusCode = {
    ACTION_COMPLETE: 200,               // OK
    CREATED: 201,                       // Resource created successfully
    ACCEPTED: 202,                      // Request accepted but processing not complete
    NO_CONTENT: 204,                    // No content to send back
    CLIENT_ERROR: 400,                  // Bad request
    UNAUTHORISED: 401,                  // Unauthorized
    FORBIDDEN: 403,                     // Forbidden
    NOT_FOUND: 404,                     // Resource not found
    CONFLICT: 409,                      // Conflict 
    UNSUPPORTED_MEDIA_TYPE: 415,        // Unsupported content type
    TOO_MANY_REQUESTS: 429,             // Rate limit exceeded
    INTERNAL_SERVER_ERROR: 500,         // Generic server error
    NOT_IMPLEMENTED: 501,               // Not implemented on server
    SERVICE_UNAVAILABLE: 503,           // Server temporarily unavailable
    GATEWAY_TIMEOUT: 504,               // Gateway timeout (useful for proxy setups)
};

export const dbTableName = {
    AUTH: "users",
    TAGS: "tags",
    CATEGORYS: "categories",
    NEWS: "news",
    BLOGS: "blogs",
};