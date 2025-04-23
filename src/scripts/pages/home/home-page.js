import HomePresenter from "./home-presenter";
import * as StoryAPI from "../../data/api";
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
      this.takeStoriesListError(message);
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

  takeStoriesListError(message) {
      const overlay = document.createElement("div");
      overlay.classList.add("modal-overlay");

      const errorPopup = document.createElement("div");
      errorPopup.classList.add("modal-popup");

      const errorMessage = document.createElement("p");
      errorMessage.textContent = `Silakan masuk terlebih dahulu untuk melihat daftar cerita. ${message}. `;

      const loginButton = document.createElement("a");
      loginButton.textContent = "Masuk";
      loginButton.href = "#/login";
      loginButton.classList.add("btn");

      loginButton.addEventListener("click", () => {
        document.body.removeChild(errorPopup);
        document.body.removeChild(overlay);
      });

      errorPopup.appendChild(errorMessage);
      errorPopup.appendChild(loginButton);

      document.body.appendChild(overlay);
      document.body.appendChild(errorPopup);
  }

  // showLoading() {
  //     document.getElementById('card-list-loading-container').innerHTML =
  //       generateLoaderAbsoluteTemplate();
  //   }

  // hideLoading() {
  //   document.getElementById('card-list-loading-container').innerHTML = '';
  // }
}
