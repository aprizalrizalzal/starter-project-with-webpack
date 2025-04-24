export default class AddNewStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  // Fungsi untuk mengirim cerita baru ke model
  async postNewStory({ description, photo, lat, lon }) {
    this.#view.showSubmitLoadingButton();
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

      this.#view.storeSuccessfully(response.message, response.data);
    } catch (error) {
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }

  async showMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.setupMap();
    } catch (error) {
      this.#view.mapFailed(error.message);
    } finally {
      this.#view.hideMapLoading();
    }
  }
}
