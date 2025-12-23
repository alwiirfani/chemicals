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
