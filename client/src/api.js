export const WEB_ROOT =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://itracker-test.herokuapp.com";
export const API_BASE = `${WEB_ROOT}/api`;
export const USER_BASE = `${API_BASE}/users`;
export const BOOKMARK_BASE = `${API_BASE}/bookmarks`;

export const USER_LOGIN_POST = `${USER_BASE}/login`;
export const USER_REGISTER_POST = `${USER_BASE}/register`;
export const USER_ID_DELETE = `${USER_BASE}`;

export const BOOKMARK_USERID_GET = `${BOOKMARK_BASE}`;
export const BOOKMARK_FOLDER_ID_GET = `${BOOKMARK_BASE}`;
export const BOOKMARK_FOLDER_POST = `${BOOKMARK_BASE}`;
export const BOOKMARK_FOLDER_PUT = `${BOOKMARK_BASE}`;
export const BOOKMARK_FOLDER_DELETE = `${BOOKMARK_BASE}`;
