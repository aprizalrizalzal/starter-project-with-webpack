import { parseActivePathname } from "../../routes/url-parser";
import DetailPresenter from "./detail-presenter";
import * as StoryAPI from "../../data/api";
import { generateCardListDetail } from "../../utils/componenet/card-list-detail";
import Map from "../../utils/leaflet/map";
import modalError from "../../utils/componenet/modal-error";
import Database from "../../data/database";

export default class DetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="container">
        <div class ="detail-page">
          <button class="button-back" id="button-back" aria-label="Kembali Ke Halaman Sebelumnya">
              <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div class="map-container">
            <div id="map" class="list-map"></div>
          </div>
          <div class="story-detail"></div>
        </div>
      </section>

      <div id="loading"></div>
    `;
  }

  async afterRender() {
    const backButton = document.getElementById("button-back");
    backButton.addEventListener("click", () => {
      window.history.back();
    });

    this.#map = document.getElementById("map");
    this.#presenter = new DetailPresenter(parseActivePathname().id, {
      view: this,
      model: StoryAPI,
      dbModel: Database,
    });

    this.#presenter.showStoriesDetail();
  }

  async takeStoriesDetail(message, story) {
    if (this.#map) {
      const coordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.name };
      const popupOptions = { content: story.name };

      this.#map.changeCamera(coordinate);
      this.#map.addMarker(coordinate, markerOptions, popupOptions);
    }

    const html = generateCardListDetail({
      ...story,
    });

    document.querySelector(".story-detail").innerHTML = `
      <div class="stories">${html}</div>
    `;

    this.#presenter.showSaveButton();
  }

  async setupMap() {
    this.#map = await Map.build("#map", {
      zoom: 10,
    });
  }

  renderSaveButton() {
    document.getElementById(
      "story-detail-action"
    ).innerHTML = `<button id="favorite-save" class="favorite-button" aria-label="Tambah ke favorit"><i class="fa-solid fa-heart"></i> Tambah ke favorit</button>`;

    const saveFavorite = document.getElementById("favorite-save");

    saveFavorite.addEventListener("click", async () => {
      await this.#presenter.saveStory();
      this.#presenter.showSaveButton();
    });
  }

  saveToFavoriteSuccessfully(message) {
    alert(message);
  }

  saveToFavoriteFailed(message) {
    alert(message);
  }

  renderRemoveButton() {
    document.getElementById(
      "story-detail-action"
    ).innerHTML = `<button id="favorite-remove" class="favorite-button" aria-label="Tambah ke favorit"><i class="fa-solid fa-heart-crack"></i> Hapus dari Favorit</button>`;

    const removeFavorite = document.getElementById("favorite-remove");

    removeFavorite.addEventListener("click", async () => {
      await this.#presenter.removeStory();
      await this.#presenter.showSaveButton();
    });
  }

  removeFromFavoriteSuccessfully(message) {
    console.log(message);
  }

  removeFromFavoriteFailed(message) {
    alert(message);
  }

  async storiesListError(message) {
    modalError(message);
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
