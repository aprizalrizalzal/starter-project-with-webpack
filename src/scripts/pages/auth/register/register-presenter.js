export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  // Fungsi untuk menangani proses register
  async getRegistered({ name, email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getRegistered({
        name,
        email,
        password,
      });

      if (!response.ok) {
        console.error("getRegistered: response:", response);
        this.#view.registeredFailed(response.message);
        return;
      }

      this.#view.registeredSuccessfully(response.message, response.data);
    } catch (error) {
      this.#view.registeredFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
