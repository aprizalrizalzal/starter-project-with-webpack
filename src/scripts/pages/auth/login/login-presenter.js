export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    // Konstruktor untuk menginisialisasi view, model, dan authModel
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    // Metode untuk menangani proses login
    this.#view.showSubmitLoadingButton(); // Menampilkan tombol loading saat proses login dimulai
    try {
      const response = await this.#model.getLogin({ email, password }); // Memanggil model untuk melakukan login

      if (!response.ok) {
        // Jika respons tidak berhasil, tampilkan pesan error
        console.error("getLogin: response:", response);
        this.#view.loginFailed(response.message); // Menampilkan pesan login gagal
        return;
      }

      // Menyimpan token akses ke authModel jika login berhasil
      this.#authModel.putAccessToken(response.loginResult.token);

      // Menampilkan pesan sukses login
      this.#view.loginSuccessfully(response.message, response.data);
    } catch (error) {
      // Menangani error yang terjadi selama proses login
      console.error("getLogin: error:", error);
      this.#view.loginFailed(error.message); // Menampilkan pesan login gagal
    } finally {
      this.#view.hideSubmitLoadingButton(); // Menyembunyikan tombol loading setelah proses selesai
    }
  }
}
