export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  // Fungsi untuk menangani proses login
  async postLogin({ email, password }) {
    this.#view.showSubmitLoadingButton(); 
    try {
      const response = await this.#model.postLogin({ email, password }); 

      if (!response.ok) {
        this.#view.loginFailed(response.message); 
        return;
      }

      this.#authModel.putAccessToken(response.loginResult.token);

      this.#view.loginSuccessfully(response.message, response.data);
    } catch (error) {
      this.#view.loginFailed(error.message); 
    } finally {
      this.#view.hideSubmitLoadingButton(); 
    }
  }
}
