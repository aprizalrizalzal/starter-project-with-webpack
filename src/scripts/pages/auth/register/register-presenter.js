export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    // Konstruktor untuk menginisialisasi view dan model
    this.#view = view;
    this.#model = model;
  }

  async getRegistered({ name, email, password }) {
    // Menampilkan tombol loading saat proses pendaftaran dimulai
    this.#view.showSubmitLoadingButton();
    try {
      // Memanggil model untuk melakukan proses pendaftaran
      const response = await this.#model.getRegistered({
        name,
        email,
        password,
      });

      // Jika respons tidak berhasil, tampilkan pesan kesalahan
      if (!response.ok) {
        console.error("getRegistered: response:", response);
        this.#view.registeredFailed(response.message);
        return;
      }

      // Jika berhasil, tampilkan pesan sukses beserta data yang diterima
      this.#view.registeredSuccessfully(response.message, response.data);
    } catch (error) {
      // Menangani error yang terjadi selama proses pendaftaran
      console.error("getRegistered: error:", error);
      this.#view.registeredFailed(error.message);
    } finally {
      // Menyembunyikan tombol loading setelah proses selesai
      this.#view.hideSubmitLoadingButton();
    }
  }
}
