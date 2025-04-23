import LoginPresenter from "./login-presenter";
import * as StoryAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <div class="login">
          <h1 class="title">Masuk</h1>

          <form id="login-form" class="login-form">
            <div class="form-control">
              <label for="email-input" class="email">Email</label>

              <div class="form-input">
                <input id="email-input" type="email" name="email" autocomplete="email" placeholder="email@example.com">
              </div>
            </div>
            <div class="form-control">
              <label for="password-input" class="password">Kata sandi</label>

              <div class="form-input">
                <input id="password-input" type="password" name="password" autocomplete="current-password" placeholder="Kata sandi">
              </div>
            </div>
            
            <div class="form-buttons">
              <div id="submit-button-container">
                <button class="btn" type="submit">Masuk</button>
              </div>
              <p class="do-not-have-account">Belum punya akun? <a href="#/register">Daftar</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };
        await this.#presenter.getLogin(data);
      });
  }

  loginSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = "/";
  }

  loginFailed(message) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const errorPopup = document.createElement("div");
    errorPopup.classList.add("modal-popup");

    const errorMessage = document.createElement("p");
    errorMessage.textContent = `Coba lagi. ${message}. `;

    const closeButton = document.createElement("a");
    closeButton.textContent = "Tutup";
    closeButton.classList.add("btn");

    closeButton.addEventListener("click", () => {
      document.body.removeChild(errorPopup);
      document.body.removeChild(overlay);
    });

    errorPopup.appendChild(errorMessage);
    errorPopup.appendChild(closeButton);

    document.body.appendChild(overlay);
    document.body.appendChild(errorPopup);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit" disabled>
        Masuk <i class="fa-solid fa-circle-notch fa-spin"></i>
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Masuk</button>
    `;
  }
}
