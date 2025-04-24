import HomePresenter from "./home-presenter";
import * as StoryAPI from "../../data/api";
import { generateCardList } from "../../utils/componenet/card-list";
import modalError from "../../utils/componenet/modal-error";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="home-title">Story</h1>

        <div class="card-container">
          <div id="card-list"></div>
        </div>
        <div id="loading"></div>
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
      this.storiesListError(message);
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      return accumulator.concat(
        generateCardList({
          ...story,
        })
      );
    }, "");

    document.getElementById("card-list").innerHTML = `
      <div class="stories">${html}</div>
    `;
  }

  storiesListError(message) {
      modalError(message + ". Silahkan Masuk untuk melihat cerita");
  }

  // Menampilkan loading saat peta sedang dimuat
  showLoading() {
    const mapLoading = document.getElementById("loading");
    if (mapLoading) {
      mapLoading.innerHTML = `
        <div class="loading-spinner">
          <i class="fa-solid fa-circle-notch fa-spin"></i> Loading...
        </div>
      `;
    }
  }

  // Menyembunyikan loading saat peta selesai dimuat
  hideLoading() {
    const mapLoading = document.getElementById("loading");
    if (mapLoading) {
      mapLoading.innerHTML = "";
    }
  }
}
