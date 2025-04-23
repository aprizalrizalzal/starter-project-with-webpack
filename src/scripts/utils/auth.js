import { getActiveRoute } from "../routes/url-parser";
import CONFIG from "../config";

function isStorageAvailable() {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getAccessToken() {
  if (!isStorageAvailable()) {
    console.warn("LocalStorage tidak tersedia. Token tidak bisa diambil.");
    return null;
  }

  try {
    const token = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);
    if (!token || token === "null" || token === "undefined") return null;

    return token;
  } catch (error) {
    console.error("getAccessToken: error:", error);
    return null;
  }
}

export function putAccessToken(token) {
  if (!isStorageAvailable()) {
    alert(
      "Gagal menyimpan token. Coba nonaktifkan mode private/incognito browser."
    );
    return false;
  }

  try {
    localStorage.setItem(CONFIG.ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error("putAccessToken: error:", error);
    return false;
  }
}

export function removeAccessToken() {
  if (!isStorageAvailable()) {
    console.warn("LocalStorage tidak tersedia. Tidak bisa menghapus token.");
    return false;
  }

  try {
    localStorage.removeItem(CONFIG.ACCESS_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error("removeAccessToken: error:", error);
    return false;
  }
}

const unauthenticatedRoutes = ["/login", "/register"];

export function checkUnauthenticated(page) {
  const url = getActiveRoute();
  const isLoggedIn = !!getAccessToken();

  if (unauthenticatedRoutes.includes(url) && isLoggedIn) {
    console.info("Sudah login, redirect ke home.");
    location.hash = "/";
    return null;
  }

  return page;
}

export function checkAuthenticated(page) {
  const isLoggedIn = !!getAccessToken();

  if (!isLoggedIn) {
    alert("Anda harus login dulu untuk mengakses halaman ini.");
    location.hash = "/login";
    return null;
  }

  return page;
}

export function getLogout() {
  const success = removeAccessToken();
  if (success) {
    location.hash = "/login";
  } else {
    alert("Gagal logout. Silakan coba lagi.");
  }
}
