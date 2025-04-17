import HomePresenter from "./home-presenter";
import * as StoryAPI from '../../data/api';
import { generateCardList } from "../../utils/componenet/card-list";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="home-title">Story</h1>

        <div class="card-container">
          <div id="card-list"></div>
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
      return accumulator.concat(
        generateCardList({
          ...story,
        }),
      );
      
    }, '');

    document.getElementById('card-list').innerHTML = `
      <div class="stories">${html}</div>
    `;
  }

  takeStoriesListError(message) {
    // document.getElementById('story-list').innerHTML = generateReportsListErrorTemplate(message);
  }

  // showLoading() {
  //     document.getElementById('card-list-loading-container').innerHTML =
  //       generateLoaderAbsoluteTemplate();
  //   }

  // hideLoading() {
  //   document.getElementById('card-list-loading-container').innerHTML = '';
  // }
}
