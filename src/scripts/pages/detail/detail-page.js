import { parseActivePathname } from "../../routes/url-parser";
import DetailPresenter from "./detail-presenter";
import * as StoryAPI from "../../data/api";
import { generateCardListDetail } from "../../utils/componenet/card-list-detail";

export default class DetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="container">
        <div class ="detail-page">
            <button class="back-button" id="back-button">
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div class="story-detail"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const backButton = document.getElementById("back-button");
    backButton.addEventListener("click", () => {
      window.history.back();
    });

    this.#map = document.getElementById("map");
    this.#presenter = new DetailPresenter(parseActivePathname().id, {
      view: this,
      model: StoryAPI,
    });
    
    this.#presenter.showStoriesDetail();
  }

  async takeStoriesDetail(message, story) {
    const html = generateCardListDetail({
      ...story,
    });

    document.querySelector(".story-detail").innerHTML = `
      <div class="stories">${html}</div>
    `;
  }

  async showLoading() {}

  async hideLoading() {}

  async storiesListError(message) {}
}
