import { storyMapper } from "../../data/api-mapper";

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

      const listStory = await Promise.all(
        response.listStory.map(async (story) => await storyMapper(story))
      );

      this.#view.takeStoriesList(response.message, listStory);
    } catch (error) {
      this.#view.storiesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
