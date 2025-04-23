import AddNewStoryPresenter from "./add-new-story-presenter.js";
import * as StoryAPI from "../../data/api.js";
import Camera from "../../utils/camera.js";

export default class AddNewStoryPage {
  #presenter;
  #form;
  #camera;
  #cameraOpen = false;
  #takePhoto = null;

  //Merender halaman
  async render() {
    return `
      <section class="container">
        <div class="add-new-story-page">
          <h1 class="add-new-story-title">Add New Story</h1>

          <div class="form-container">
            <form id="add-new-story-form" class="add-new-story-form" enctype="multipart/form-data">
              <!-- Description -->
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

              <!-- Upload Photo -->
              <div class="form-control photo-control">
                <label for="photo-input" class="photo-label">Photo</label>
                <div class="photo-upload-container">
                  <button id="select-file" class="upload-button" type="button">
                    <i class="fa-solid fa-upload"></i> Upload Image
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
                  <button id="open-camera" class="camera-button" type="button">
                    <i class="fa-solid fa-camera"></i> Open Camera
                  </button>
                </div>

                <!-- Camera -->
                <div id="camera-container" class="camera-container">
                  <video id="camera-video" class="camera-video" autoplay></video>
                  <canvas id="camera-canvas" class="camera-canvas"></canvas>

                  <div class="camera-tools">
                    <select id="camera-select" class="camera-select"></select>
                    <button id="camera-button" class="capture-button" type="button">Capture</button>
                  </div>
                </div>

                <!-- Photo Preview -->
                <div id="photo-preview" class="photo-preview"></div>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  //Dijalankan setelah halaman dirender
  async afterRender() {
    this.#presenter = new AddNewStoryPresenter({
      view: this,
      model: StoryAPI,
    });
    this.#takePhoto = null;

    this.#setupForm();
  }

  //Mengatur form dan event-event terkait
  #setupForm() {
    this.#form = document.getElementById("add-new-story-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem("description").value,
        photo: this.#takePhoto ? [this.#takePhoto.blob] : [],
      };

      await this.#presenter.postNewStory(data);
    });

    const selectFileButton = document.getElementById("select-file");
    const photoInput = document.getElementById("photo-input");
    const cameraContainer = document.getElementById("camera-container");

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

  //Mengatur kamera
  #setupCamera() {
    if (this.#camera) {
      return;
    }

    this.#camera = new Camera({
      cameraVideo: document.getElementById("camera-video"),
      cameraSelect: document.getElementById("camera-select"),
      cameraCanvas: document.getElementById("camera-canvas"),
    });

    this.#camera.addCheeseButtonListener("#camera-button", async () => {
      const photo = await this.#camera.takePhoto();
      await this.#addTakePhoto(photo);
      await this.#previewPhoto(photo);
    });
  }

  //Menambahkan foto yang diambil dari kamera
  async #addTakePhoto(image) {
    let blob = image;

    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, "image/png");
    }

    const fileName = `photo-${Date.now()}.png`;
    this.#takePhoto = {
      blob: new Blob([blob], { type: "image/png" }),
      fileName: fileName,
    };
  }

  //Menampilkan pratinjau foto
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
}
