import { storyMapper } from "../../data/api-mapper";

export default class DetailPresenter {
  #storyId;
  #view;
  #model;
  #dbModel;

  constructor(storyId, { view, model, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
  }

  async showStoryDetailMap() {
    this.#view.showLoading();
    try {
      await this.#view.setupMap();
    } catch (error) {
      console.error("showStoryDetailMap: error:", error);
    } finally {
      this.#view.hideLoading();
    }
  }

  async showStoriesDetail() {
    this.#view.showLoading();
    try {
      await this.showStoryDetailMap();

      const response = await this.#model.getStoryById(this.#storyId);

      if (!response.ok) {
        this.#view.storiesListError(response.message);
        return;
      }

      const story = await storyMapper(response.story);

      this.#view.takeStoriesDetail(response.message, story);
    } catch (error) {
      this.#view.storiesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }

  async saveStory() {
    try {
      const story = await this.#model.getStoryById(this.#storyId);
      await this.#dbModel.putStory(story.story);

      this.#view.saveToFavoriteSuccessfully("Success to save to favorite");
    } catch (error) {
      console.error("saveStory: error:", error);
      this.#view.saveToFavoriteFailed(error.message);
    }
  }

  async removeStory() {
    try {
      await this.#dbModel.removeStory(this.#storyId);

      this.#view.removeFromFavoriteSuccessfully(
        "Success to remove from favorite"
      );
    } catch (error) {
      console.error("removeStory: error:", error);
      this.#view.removeFromFavoriteFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }

    this.#view.renderSaveButton();
  }

  async #isStorySaved() {
    return !!(await this.#dbModel.getStoryById(this.#storyId));
  }
}
