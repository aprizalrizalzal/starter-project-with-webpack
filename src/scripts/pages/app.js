import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { isServiceWorkerAvailable } from "../utils";
import { getAccessToken, getLogout } from "../utils/auth";
import {
  generateAuthenticatedNavList,
  generateUnauthenticatedNavList,
} from "../utils/componenet/nav-list";
import { transitionHelper } from "../utils/transition/helper";
import {
  isCurrentPushSubscriptionAvailable,
  unsubscribe,
  subscribe,
} from "../utils/notification-helper";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    if (!this.#drawerButton || !this.#navigationDrawer) return;

    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  #setupNavigationList() {
    const navList = this.#navigationDrawer?.children?.namedItem("nav-list");
    if (!navList) return;

    const isLogin = !!getAccessToken();

    try {
      navList.innerHTML = isLogin
        ? generateAuthenticatedNavList()
        : generateUnauthenticatedNavList();
    } catch (error) {
      console.error("Gagal generate navigasi:", error);
      navList.innerHTML = "<li>Terjadi kesalahan memuat navigasi</li>";
      return;
    }

    if (isLogin) {
      const logoutButton = document.getElementById("logout");
      if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
          event.preventDefault();

          // Create modal overlay
          const overlay = document.createElement("div");
          overlay.classList.add("modal-overlay");

          // Create modal popup
          const modalPopup = document.createElement("div");
          modalPopup.classList.add("modal-popup");

          // Create modal message
          const modalMessage = document.createElement("p");
          modalMessage.textContent = "Apakah Anda yakin ingin keluar?";

          // Create button container
          const buttonContainer = document.createElement("div");
          buttonContainer.classList.add("button-container");

          // Create confirm button
          const confirmButton = document.createElement("button");
          confirmButton.textContent = "Ya";
          confirmButton.classList.add("button-confirm");

          confirmButton.addEventListener("click", () => {
            getLogout();

            // Redirect
            location.hash = "/login";

            // Remove modal
            document.body.removeChild(modalPopup);
            document.body.removeChild(overlay);
          });

          // Create cancel button
          const cancelButton = document.createElement("button");
          cancelButton.textContent = "Batal";
          cancelButton.classList.add("button-cancel");

          cancelButton.addEventListener("click", () => {
            // Remove modal
            document.body.removeChild(modalPopup);
            document.body.removeChild(overlay);
          });

          // Append buttons to button container
          buttonContainer.appendChild(confirmButton);
          buttonContainer.appendChild(cancelButton);

          // Append elements to modal popup
          modalPopup.appendChild(modalMessage);
          modalPopup.appendChild(buttonContainer);

          // Append modal popup and overlay to body
          document.body.appendChild(overlay);
          document.body.appendChild(modalPopup);
        });
      }
    }
  }

  async #setupPushNotification() {
    const subscribeBtn = document.getElementById("subscribe-button");
    const unsubscribeBtn = document.getElementById("unsubscribe-button");

    if (!subscribeBtn || !unsubscribeBtn) return;

    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      subscribeBtn.style.display = "none";
      unsubscribeBtn.style.display = "block";
    } else {
      subscribeBtn.style.display = "block";
      unsubscribeBtn.style.display = "none";
    }

    const subscribeBtnClone = subscribeBtn.cloneNode(true);
    const unsubscribeBtnClone = unsubscribeBtn.cloneNode(true);

    subscribeBtn.parentNode.replaceChild(subscribeBtnClone, subscribeBtn);
    unsubscribeBtn.parentNode.replaceChild(unsubscribeBtnClone, unsubscribeBtn);

    subscribeBtnClone.addEventListener("click", () => {
      console.log("subscribe button clicked");

      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });

    unsubscribeBtnClone.addEventListener("click", () => {
      console.log("unsubscribe button clicked");

      unsubscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    if (!route) {
      this.#content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
      return;
    }

    const page = typeof route === "function" ? route() : route;

    const updateContent = async () => {
      try {
        this.#content.innerHTML = await page.render();
        await page.afterRender?.();
      } catch (error) {
        console.error("Gagal merender halaman:", error);
        this.#content.innerHTML =
          "<p>Terjadi kesalahan saat memuat halaman.</p>";
      }
    };

    if (!document.startViewTransition) {
      await updateContent();
      this.#setupNavigationList();
      return;
    }

    const transition = transitionHelper({ updateDOM: updateContent });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: "instant" });
      this.#setupNavigationList();

      if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
    });
  }
}

export default App;
