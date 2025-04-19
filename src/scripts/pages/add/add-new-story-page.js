import AddNewStoryPresenter from './add-new-story-presenter.js';
import * as StoryAPI from '../../data/api.js';

export default class AddNewStoryPage {
  #presenter;
  #form;
  #camera;
  #cameraOpen = false;
  #takePhoto = [];
  #map = null;

  async render() {
    return `
    <section class="container">
        <h1 class="">Add New Story</h1>

        <div class="">
            <form id="add-new-story-form" class="add-new-story-form" enctype="multipart/form-data">
                <div class="form-control">
                    <label for="description-input" class="description">Deskripsi</label>

                    <div class="form-input">
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Deskripsi cerita Anda"
                            aria-describedby="Deskripsi cerita Anda"
                        ></textarea>
                    </div>
                </div>

                <div class="form-control">
                    <label for="photo-input" class="">Poto</label>
                    <div class="">
                        <div class="">
                            <button id="" class="" type="button">Ambil Gambar</button>
                            <input
                            id=""
                            name=""
                            type="file"
                            accept="image/*"
                            multiple
                            hidden="hidden"
                            aria-multiline="false"
                            aria-describedby=""
                            />
                            <button id="" class="" type="button">Buka Kamera</button>
                        </div>
                        <div id="" class="">
                            <video id="" class="">Video stream not available.</video>
                            <canvas id="" class=""></canvas>

                            <div class="">
                            <select id=""></select>
                            <div class="">
                                <button id="" class="" type="button">Ambil Gambar</button>
                            </div>
                            </div>
                        </div>
                        <ul
                            id=""
                            class=""
                        ></ul>
                    </div>
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
    })
  }

  #setupForm() {
    this.#form = document.getElementById('add-new-story-form');
    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem('description').value,
        photo: this.#form.elements.namedItem('photo').files[0],
      };

      await this.#presenter.postNewStory(data);
    });
  }
}
