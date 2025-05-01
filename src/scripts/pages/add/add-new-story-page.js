import AddNewStoryPresenter from "./add-new-story-presenter.js";
import * as StoryAPI from "../../data/api.js";
import Camera from "../../utils/media/camera.js";
import Map from "../../utils/leaflet/map.js";
import { convertBase64ToBlob } from "../../utils/index.js";
import modalError from "../../utils/componenet/modal-error.js";

export default class AddNewStoryPage {
  #presenter;
  #form;
  #camera;
  #cameraOpen = false;
  #takePhoto = null;
  #map = null;

  // Merender halaman utama
  async render() {
    return `
      <section class="container">
        <button class="button-back" id="button-back" aria-label="Kembali Ke Halaman Sebelumnya">
            <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div class="add-new-story-page">
          <h1 class="add-new-story-title">Add New Story</h1>
          <div class="form-container">
            <form id="add-new-story-form" class="add-new-story-form" enctype="multipart/form-data">
              <!-- Deskripsi -->
              <div class="description-control">
                <label for="description" class="description-label">Description</label>
                <div class="description-input">
                  <textarea
                    id="description"
                    name="description"
                    class="description-textarea"
                    placeholder="Describe your story"
                    aria-describedby="Describe your story"
                  ></textarea>
                </div>
              </div>

              <!-- Unggah Foto -->
              <div class="photo-control">
                <label for="photo-input" class="photo-label">Photo</label>
                <div class="photo-upload-container">
                  <button id="select-file" class="upload-button" type="button" aria-label="Unggah Foto">
                    Unggah Foto
                  </button>
                  <div class="photo-input-container">
                    <input
                      id="photo-input"
                      type="file"
                      name="photo"
                      class="input photo-input"
                      accept="image/*"
                      hidden="hidden"
                      aria-describedby="Select a photo for your story"
                    />
                  </div>
                  <button id="open-camera" class="camera-button" type="button" aria-label="Buka Kamera">
                    Buka Kamera
                  </button>
                </div>

                <!-- Kamera -->
                <div id="camera-container" class="camera-container">
                  <video id="camera-video" class="camera-video" autoplay></video>
                  <canvas id="camera-canvas" class="camera-canvas"></canvas>

                  <div class="camera-tools">
                    <select id="camera-select" class="camera-select"></select>
                    <button id="camera-button" class="capture-button" type="button" aria-label="Ambil Gambar">Ambil gambar</button>
                  </div>
                </div>

                <!-- Pratinjau Foto -->
                <div id="photo-preview" class="photo-preview"></div>
              </div>

              <!-- Pratinjau Peta -->
              <div class="map-control">
                <div class="map-title">Lokasi</div>
                <div class="map-container">
                  <div class="map-location-container">
                    <div id="map" class="map"></div>
                    <div id="map-loading"></div>
                  </div>
                  <div class="location-input-container">
                    <input type="number" name="latitude" value="" disabled>
                    <input type="number" name="longitude" value="" disabled>
                  </div>
                </div>
              </div>

              <div class="form-buttons-container">
                <div id="submit-button-container">
                  <button class="submit-button" type="submit" aria-label="Buat Cerita">Buat Cerita</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  // Dijalankan setelah halaman dirender
  async afterRender() {
    const backButton = document.getElementById("button-back");
    backButton.addEventListener("click", () => {
      window.history.back();
    });

    this.#presenter = new AddNewStoryPresenter({
      view: this,
      model: StoryAPI,
    });
    this.#takePhoto = null;
    this.#presenter.showMap();

    this.#setupForm();
  }

  // Mengatur form dan event-event terkait
  #setupForm() {
    this.#form = document.getElementById("add-new-story-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem("description").value,
        photo: this.#takePhoto ? [this.#takePhoto.blob] : [],
        lat: this.#form.elements.namedItem('latitude').value,
        lon: this.#form.elements.namedItem('longitude').value,
      };

      await this.#presenter.postNewStory(data);
    });

    const selectFileButton = document.getElementById("select-file");
    const photoInput = document.getElementById("photo-input");
    const cameraContainer = document.getElementById("camera-container");

    // Event untuk membuka/menutup kamera
    document.getElementById("open-camera").addEventListener("click", async (event) => {
      cameraContainer.classList.toggle("show-camera");

      this.#cameraOpen = cameraContainer.classList.contains("show-camera");
      if (this.#cameraOpen) {
        cameraContainer.style.display = "block";
        event.currentTarget.textContent = "Close Camera";
        this.#setupCamera();
        this.#camera.launch();
        return;
      }

      event.currentTarget.textContent = "Open Camera";
      cameraContainer.style.display = "none";
      this.#camera.stop();
    });

    // Event untuk memilih file foto
    if (selectFileButton && photoInput) {
      selectFileButton.addEventListener("click", () => {
        photoInput.click();
      });

      photoInput.addEventListener("change", (event) => {
        const image = event.target.files[0];
        if (image) {
          this.#takePhoto = { blob: image };
          this.#previewPhoto(image);
        }
      });
    }
  }

  // Mengatur kamera
  #setupCamera() {
    if (this.#camera) {
      return;
    }

    this.#camera = new Camera({
      cameraVideo: document.getElementById("camera-video"),
      cameraSelect: document.getElementById("camera-select"),
      cameraCanvas: document.getElementById("camera-canvas"),
    });

    // Event untuk menangkap foto dari kamera
    this.#camera.addCheeseButtonListener("#camera-button", async () => {
      const photo = await this.#camera.takePhoto();
      await this.#addTakePhoto(photo);
      await this.#previewPhoto(photo);
    });
  }

  // Menambahkan foto yang diambil dari kamera atau base64
  async #addTakePhoto(image) {
    let blob = image;

    if (typeof image === "string") {
      blob = convertBase64ToBlob(image, "image/png");
    }

    const fileName = `photo-${Date.now()}.png`;
    this.#takePhoto = {
      blob: new Blob([blob], { type: "image/png" }),
      fileName: fileName,
    };
  }

  // Menampilkan pratinjau foto
  async #previewPhoto(image) {
    const previewContainer = document.getElementById("photo-preview");
    if (!previewContainer) return;

    previewContainer.innerHTML = "";

    this.#takePhoto = { blob: image };

    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("preview-image-wrapper");

    const img = document.createElement("img");
    img.src = URL.createObjectURL(image);
    img.alt = "Preview Foto";
    img.classList.add("preview-image");

    imgWrapper.appendChild(img);
    previewContainer.appendChild(imgWrapper);
  }

  // Mengatur peta
  async setupMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
      locate: true,
    });

    const centerCoordinates = this.#map.getCenter();

    this.#updateMapCoordinates(centerCoordinates.latitude, centerCoordinates.longitude);

    const draggableMarker = this.#map.addMarker([centerCoordinates.latitude, centerCoordinates.longitude], {
      draggable: true,
    });

    // Event untuk memperbarui koordinat saat marker dipindahkan
    draggableMarker.on('move', (event) => {
      const coordinate = event.target.getLatLng();
      this.#map.changeCamera(coordinate);
      this.#updateMapCoordinates(coordinate.lat, coordinate.lon);
    });

    // Event untuk memperbarui koordinat saat peta diklik
    this.#map.addMapEventListener('click', (event) => {
      draggableMarker.setLatLng(event.latlon);
      this.#map.changeCamera(event.latlon);
      this.#updateMapCoordinates(event.latlon.lat, event.latlon.lon);
    });
  }

  // Memperbarui koordinat pada form
  #updateMapCoordinates(lat, lon) {
    this.#form.elements.namedItem('latitude').value = lat;
    this.#form.elements.namedItem('longitude').value = lon;
  }

  // Menampilkan loading saat peta sedang dimuat
  showLoading() {
    const mapLoading = document.getElementById("map-loading");
    if (mapLoading) {
      mapLoading.innerHTML = `
        <div class="loading-spinner">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
        </div>
      `;
    }
  }

  // Menyembunyikan loading saat peta selesai dimuat
  hideLoading() {
    const mapLoading = document.getElementById("map-loading");
    if (mapLoading) {
      mapLoading.innerHTML = "";
    }
  }

  // Menampilkan pesan kesalahan saat peta gagal dimuat
  mapFailed(message) {
    modalError(message);
  }

  // Menampilkan pesan sukses saat cerita berhasil disimpan
  storeSuccessfully(message, data) {
    console.log(message, data);
    location.hash = "/";
  }

  // Menampilkan pesan kesalahan saat penyimpanan cerita gagal
  storeFailed(message) {
    modalError(message);
  }

  // Menampilkan loading saat tombol submit ditekan
  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
        <button id="submit-button" class="submit-button" type="submit" disabled>
          <i class="fa-solid fa-circle-notch fa-spin"></i> Loading...
        </button>
      `;
  }

  // Menyembunyikan loading setelah tombol submit selesai
  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
        <button class="submit-button" type="submit" aria-label="Buat Cerita">Buat Cerita</button>
      `;
  }
}
