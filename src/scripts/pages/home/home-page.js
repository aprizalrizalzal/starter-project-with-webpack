import HomePresenter from "./home-presenter";
import * as StoryAPI from "../../data/api";
import { generateCardList } from "../../utils/componenet/card-list";
import modalError from "../../utils/componenet/modal-error";
import Map from "../../utils/leaflet/map";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="map-container">
          <div id="map" class="list-map"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="home-title">Story</h1>

        <div class="card-container">
          <div id="card-list"></div>
        </div>
      </section>
          
      <div id="loading"></div>
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
      if (this.#map) {

        const coordinate = [story.lat, story.lon];
        const markerOptions = { alt: story.name };
        const popupOptions = { content: story.name };

      this.#map.changeCamera(coordinate);
        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

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

  async setupMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
    });
  }

  storiesListError(message) {
      modalError(message);
  }

  // Menampilkan loading saat sedang dimuat
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
