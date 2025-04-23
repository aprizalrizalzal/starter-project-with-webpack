export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async fetchAllStories() {
    //   this.#view.showLoading();
    try {
      const response = await this.#model.getAllStories();

      if (!response.ok) {
        console.error("fetchAllStories: response:", response);
        this.#view.takeStoriesListError(response.message);
        return;
      }

      this.#view.takeStoriesList(response.message, response.listStory);
    } catch (error) {
      console.error("fetchAllStories: error:", error);
      this.#view.takeStoriesListError(error.message);
    } finally {
      // this.#view.hideLoading();
    }
  }
}
