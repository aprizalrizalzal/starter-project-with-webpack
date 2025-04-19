export default class AddNewStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async postNewStory({ description, photo, lat, lon }) {
    try {
      const data = {
        description: description,
        photo: photo,
        lat: lat,
        lon: lon,
      };

      const response = await this.#model.storeAddNewStory(data);

      if (!response.ok) {
        this.#view.storeFailed(response.message);
        return;
      }

      this.#view.storeSuccessfully(response.message, response.data)
    } catch (error) {
        this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
