export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async fetchAllStories() {
    this.#view.showLoading();
    try {
      const response = await this.#model.getAllStories();

      if (!response.ok) {
        this.#view.storiesListError(response.message);
        return;
      }

      this.#view.takeStoriesList(response.message, response.listStory);
    } catch (error) {
      this.#view.storiesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
