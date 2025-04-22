import AddNewStoryPresenter from './add-new-story-presenter.js';
import * as StoryAPI from '../../data/api.js';
import Camera from '../../utils/camera.js';

export default class AddNewStoryPage {
    #presenter;
    #form;
    #camera;
    #cameraOpen = false;
    #takePhoto = null; // Ubah menjadi null untuk menyimpan satu foto saja

    async render() {
        return `
        <section class="container">
            <h1>Add New Story</h1>

            <div class="form-container">
                <form id="add-new-story-form" class="add-new-story-form" enctype="multipart/form-data">
                    <!-- Deskripsi -->
                    <div class="form-control">
                        <label for="description">Deskripsi</label>
                        <div class="form-input">
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Deskripsi cerita Anda"
                                aria-describedby="Deskripsi cerita Anda"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Upload Foto -->
                    <div class="form-control">
                        <label for="photo-input">Foto</label>
                        <div class="container-form-upload">
                            <button id="select-file" class="btn" type="button">
                                <i class="fa-solid fa-upload"></i> Gambar
                            </button>
                            <div class="form-input">
                                <input
                                    id="photo-input"
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    hidden="hidden"
                                    aria-describedby="Pilih foto untuk cerita Anda"
                                />
                            </div>
                            <button id="open-camera" class="btn" type="button">
                                <i class="fa-solid fa-camera"></i> Kamera
                            </button>
                        </div>

                        <!-- Kamera -->
                        <div id="camera-container" class="camera-container">
                            <video id="camera-video" class="camera-video" autoplay></video>
                            <canvas id="camera-canvas" class="camera-canvas"></canvas>

                            <div class="camera-tools">
                                <select id="camera-select"></select>
                                <button id="camera-button" class="btn" type="button">Ambil</button>
                            </div>
                        </div>

                        <!-- Preview Foto -->
                        <div id="photo-preview" class="photo-preview"></div>
                    </div>
                </form>
            </div>
        </section>
        `;
    }

    async afterRender() {
        this.#presenter = new AddNewStoryPresenter({
            view: this,
            model: StoryAPI,
        });
        this.#takePhoto = null;

        this.#setupForm();
    }

    #setupForm() {
        this.#form = document.getElementById('add-new-story-form');
        if (!this.#form) return;

        this.#form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const data = {
                description: this.#form.elements.namedItem('description').value,
                photo: this.#takePhoto ? [this.#takePhoto.blob] : [],
            };

            await this.#presenter.postNewStory(data);
        });

        const selectFileButton = document.getElementById('select-file');
        const photoInput = document.getElementById('photo-input');
        const openCameraButton = document.getElementById('open-camera');

        if (selectFileButton && photoInput) {
            selectFileButton.addEventListener('click', () => {
                photoInput.click();
            });

            photoInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    this.#takePhoto = { blob: file };
                    this.#previewPhoto(file);
                }
            });
        }

        if (openCameraButton) {
            openCameraButton.addEventListener('click', async () => {
                if (!this.#cameraOpen) {
                    this.#setupCamera();
                    await this.#camera.launch();
                    this.#cameraOpen = true;
                }
            });
        }
    }

    #setupCamera() {
        if (!this.#camera) {
            this.#camera = new Camera({
                cameraVideo: document.getElementById('camera-video'),
                cameraSelect: document.getElementById('camera-select'),
                cameraCanvas: document.getElementById('camera-canvas'),
            });
        }

        this.#camera.addCheeseButtonListener('#camera-button', async () => {
            const photo = await this.#camera.takePhoto();
            this.#addTakePhoto(photo);
            this.#previewPhoto(photo); 

            if (this.#cameraOpen) {
                this.#camera.stopCamera();
                this.#cameraOpen = false;
            }
        });
    }

    #addTakePhoto(file) {
        if (!file) return;

        this.#takePhoto = { blob: file };

        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('preview-image-wrapper');

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = 'Preview Foto';
        img.classList.add('preview-image');

        imgWrapper.appendChild(img);
        document.getElementById('photo-preview').appendChild(imgWrapper);
    }

    #previewPhoto(file) {
        const previewContainer = document.getElementById('photo-preview');
        if (!previewContainer) return;

        previewContainer.innerHTML = ''; 

        this.#takePhoto = { blob: file }; 

        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('preview-image-wrapper');

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = 'Preview Foto';
        img.classList.add('preview-image');

        imgWrapper.appendChild(img);
        previewContainer.appendChild(imgWrapper);
    }
}
