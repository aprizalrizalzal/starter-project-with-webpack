import RegisterPresenter from './register-presenter';
import * as StoryAPI from '../../../data/api';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <div class="register">
          <h1 class="title">Daftar</h1>

          <form id="register-form" class="register-form">
            <div class="form-control">
              <label for="name-input" class="name">Nama</label>

              <div class="form-input">
                <input id="name-input" type="text" name="name" autocomplete="name" placeholder="Nama lengkap">
              </div>
            </div>
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
                <button class="btn" type="submit">Daftar</button>
              </div>
              <p class="already-have-account">Sudah punya akun? <a href="#/login">Masuk</a></p>
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
    document.getElementById('register-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };
      await this.#presenter.getRegistered(data);
    });
  }

  registeredSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = '/login';
  }

  registeredFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Daftar
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Daftar</button>
    `;
  }
}
