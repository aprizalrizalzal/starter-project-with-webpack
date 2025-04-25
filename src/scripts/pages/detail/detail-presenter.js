export default class DetailPresenter {
    #storyId;
    #view;
    #model;

    constructor(storyId, { view, model }) {
        this.#storyId = storyId;
        this.#view = view;
        this.#model = model;
    }

    async showStoriesDetail() {
        this.#view.showLoading();
        try {
            const response = await this.#model.getStoriesById(this.#storyId);

            if (!response.ok) {
                this.#view.storiesListError(response.message);
                return;
            }

            this.#view.takeStoriesDetail(response.message, response.story);
        } catch (error) {
            this.#view.storiesListError(error.message);
        } finally {
            this.#view.hideLoading();
        }
    }
}