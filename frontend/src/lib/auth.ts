// Auth helper — decode JWT, check role
export const decodeJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};
