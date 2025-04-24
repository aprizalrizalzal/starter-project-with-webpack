import LoginPresenter from "./login-presenter";
import * as StoryAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";
import modalError from "../../../utils/componenet/modal-error";

export default class LoginPage {
  #presenter = null;

  // Method untuk merender halaman login
  async render() {
    return `
      <section class="container">

        <div class="login">

          <h1 class="login-title">Masuk</h1>

          <form id="login-form" class="login-form">
  
            <div class="email-form-control">
              <label for="email-input" class="email-label">Email</label>
              <div class="email-input-container">
                <input id="email-input" type="email" name="email" autocomplete="email" placeholder="email@example.com">
              </div>
            </div>

            <div class="password-form-control">
              <label for="password-input" class="password-label">Kata sandi</label>
              <div class="password-input-container">
                <input id="password-input" type="password" name="password" autocomplete="current-password" placeholder="Kata sandi">
              </div>
            </div>
          
            <div class="form-buttons-container">
              <div id="submit-button-container" class="submit-button-container">
                <button id="submit-button" class="submit-button" type="submit">Masuk</button>
              </div>
              <p class="do-not-have-account">Belum punya akun? <a href="#/register" id="register-link" class="register-link">Daftar</a></p>
            </div>

          </form>

        </div>

      </section>
    `;
  }

  // Method yang dijalankan setelah halaman dirender
  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  // Method untuk mengatur event listener pada form login
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

  // Method yang dipanggil ketika login berhasil
  loginSuccessfully(message) {
    console.log(message);
    location.hash = "/";
  }

  // Method yang dipanggil ketika login gagal
  loginFailed(message) {
    console.log(message);
    
    modalError(message);
  }

  // Method untuk menampilkan tombol loading saat submit
  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button id="submit-button" class="submit-button" type="submit">
        Masuk <i class="fa-solid fa-circle-notch fa-spin"></i>
      </button>
    `;
  }

  // Method untuk menyembunyikan tombol loading setelah submit selesai
  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button id="submit-button" class="submit-button" type="submit">
        Masuk
      </button>
    `;
  }
}
