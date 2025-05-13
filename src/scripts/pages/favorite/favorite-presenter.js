export default class FavoritePresenter {
  #view;
  #model;
 
  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }
 
  async showFavoriteSaved() {
    this.#view.showLoading();
 
    try {
      const stories = await this.#model.getAllStory();
      
      const message = 'Berhasil mendapatkan daftar cerita tersimpan.';
      this.#view.populateFavoriteStory(message, stories);
    } catch (error) {
      console.log("showFavoriteSaved: error:", error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}