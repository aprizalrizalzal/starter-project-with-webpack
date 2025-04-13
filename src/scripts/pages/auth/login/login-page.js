import LoginPresenter from './login-presenter';
import * as StoryAPI from '../../../data/api';

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <div class="login">
          <h1 class="title">Dicoding Story</h1>

          <form id="login-form" class="login-form">
            <div class="form-control">
              <label for="email-input" class="email">Email</label>

              <div class="form-input">
                <input id="email-input" type="email" name="email" placeholder="email@example.com">
              </div>
            </div>
            <div class="form-control">
              <label for="password-input" class="password">Kata sandi</label>

              <div class="form-input">
                <input id="password-input" type="password" name="password" placeholder="Kata sandi">
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
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('login-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };
      await this.#presenter.getLogined(data);
    });
  }

  loginedSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = '/login';
  }

  loginedFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Masuk akun
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Masuk akun</button>
    `;
  }
}
