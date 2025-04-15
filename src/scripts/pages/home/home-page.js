import HomePresenter from "./home-presenter";
import * as StoryAPI from '../../data/api';
import { generateCardList } from "../componenet/card-list";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1>Dicoding Story</h1>

        <div class="card-container">
          <div id="stories-list"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.fetchAllStories();
  }

  takeStoriesList(message, stories) {
    if (stories.length <= 0) {
      // this.populateReportsListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      console.log(story);
      return accumulator.concat(
        generateCardList({
          ...story,
        }),
      );
      
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories">${html}</div>
    `;
  }

  takeStoriesListError(message) {
    // document.getElementById('story-list').innerHTML = generateReportsListErrorTemplate(message);
  }

  // showLoading() {
  //     document.getElementById('stories-list-loading-container').innerHTML =
  //       generateLoaderAbsoluteTemplate();
  //   }

  // hideLoading() {
  //   document.getElementById('stories-list-loading-container').innerHTML = '';
  // }
}
