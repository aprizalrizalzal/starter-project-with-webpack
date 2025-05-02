import { storyMapper } from "../../data/api-mapper";

export default class DetailPresenter {
    #storyId;
    #view;
    #model;

    constructor(storyId, { view, model }) {
        this.#storyId = storyId;
        this.#view = view;
        this.#model = model;
    }

    async showStoryDetailMap() {
        this.#view.showLoading();
        try {
          await this.#view.setupMap();
        } catch (error) {
          console.error('showStoryDetailMap: error:', error);
        } finally {
          this.#view.hideLoading();
        }
      }

    async showStoriesDetail() {
        this.#view.showLoading();
        try {
            await this.showStoryDetailMap();

            const response = await this.#model.getStoriesById(this.#storyId);

            if (!response.ok) {
                this.#view.storiesListError(response.message);
                return;
            }

            const story = await storyMapper(response.story)

            this.#view.takeStoriesDetail(response.message, story);
        } catch (error) {
            this.#view.storiesListError(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}