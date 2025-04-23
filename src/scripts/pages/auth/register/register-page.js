import RegisterPresenter from "./register-presenter";
import * as StoryAPI from "../../../data/api";
import modalError from "../../../utils/componenet/modal-error";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">

        <div class="register">
        
          <h1 class="register-title">Daftar</h1>

          <form id="register-form" class="register-form">
        
            <div class="name-form-control">
              <label for="name-input" class="name-label">Nama</label>
              <div class="name-input-container">
                <input id="name-input" type="text" name="name" autocomplete="name" placeholder="Nama lengkap" class="form-input">
              </div>
            </div>
          
            <div class="email-form-control">
              <label for="email-input" class="email-label">Email</label>
              <div class="email-input-container">
                <input id="email-input" type="email" name="email" autocomplete="email" placeholder="email@example.com" class="form-input">
              </div>
            </div>
          
            <div class="password-form-control">
              <label for="password-input" class="password-label">Kata sandi</label>
              <div class="password-input-container">
                <input id="password-input" type="password" name="password" autocomplete="current-password" placeholder="Kata sandi" class="form-input">
              </div>
            </div>
          
            <div class="form-buttons-container">
              <div id="submit-button-container" class="submit-button-container">
                <button id="submit-button" class="submit-button" type="submit">Daftar</button>
              </div>
              <p class="have-account">Sudah punya akun? <a href="#/login" id="login-link" class="login-link">Masuk</a></p>
            </div>

          </form>

        </div>

      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          name: document.getElementById("name-input").value,
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };
        await this.#presenter.getRegistered(data);
      });
  }

  registeredSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = "/login";
  }

  registeredFailed(message) {
    console.log(message);
    
    modalError(message);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button id="submit-button" class="submit-button" type="submit">
        Daftar <i class="fas fa-spinner loader-button"></i>
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button id="submit-button" class="submit-button" type="submit">
        Daftar
      </button>
    `;
  }
}
