import { generateCardListFavorite } from "../../utils/componenet/card-list";
import FavoritePresenter from "./favorite-presenter";
import Database from "../../data/database";

export default class FavoritePage {
  #presenter = null;

  async render() {
    return `
    <section class="container">
        <div style="display: flex; align-items: center; gap: 10px; justify-content: space-between;">
            <button class="button-back" id="button-back" aria-label="Kembali Ke Halaman Sebelumnya">
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <h1 class="favorite-title">Favorite</h1>
        </div>
        <div class="card-container">
            <div id="card-list"></div>
        </div>
    </section>

    <div id="loading"></div>
    `;
  }

  async afterRender() {
    this.#presenter = new FavoritePresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.showFavoriteSaved();
  }

  populateFavoriteStory(message, stories) {
    if (stories.length <= 0) {
      alert(message);
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      return accumulator.concat(
        generateCardListFavorite({
          ...story,
        })
      );
    }, "");

    document.getElementById("card-list").innerHTML = `
      <div class="stories">${html}</div>
    `;
  }

  showLoading() {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.innerHTML = `
        <div class="loading-spinner">
          <i class="fa-solid fa-circle-notch fa-spin"></i> Loading...
        </div>
      `;
    }
  }

  // Menyembunyikan loading saat selesai dimuat
  hideLoading() {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.innerHTML = "";
    }
  }
}
