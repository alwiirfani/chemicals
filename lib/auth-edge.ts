export function isTokenExpiredRuntimeEdge(token: string): boolean {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const { exp } = JSON.parse(decodedPayload);

    if (!exp) return true;
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/*
// cek token apakah expired
export const isTokenExpiredRuntimeEdge = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const { exp } = JSON.parse(decodedPayload);

    console.log("Token Expiration Time (exp):", new Date(exp * 1000));
    console.log("Current Time:", new Date());

    if (!exp) {
      console.log("Token does not have an 'exp' property.");
      return true;
    }

    const expiryDate = new Date(exp * 1000);
    const isExpired = expiryDate.getTime() < Date.now();
    console.log("Is token expired?", isExpired);
    return isExpired;
  } catch (error) {
    console.error(
      "Error parsing token. Token will be considered invalid.",
      error
    );
    return true;
  }
};


// apakah token masih aktif (tidak expired) (runtime nodejs)
export function isTokenExpiredRuntimeNodeJS(token: string): boolean {
  try {
    const payload = verifyToken(token) as UserAuth;
    console.log("Payload: ", payload);

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.log("Token expired: ", error);
    return true;
  }
}
  */
