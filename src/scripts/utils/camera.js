export default class Camera {
    #currentStream;
    #streaming = false;
    #width = 640;
    #height = 0;
  
    #cameraVideoElement;
    #cameraSelectElement;
    #cameraCanvasElement;
    #cameraButtonElement;
  
    static addNewStream(stream) {
      if (!Array.isArray(window.currentStreams)) {
        window.currentStreams = [stream];
        return;
      }
      window.currentStreams = [...window.currentStreams, stream];
    }
  
    static stopAllStreams() {
      if (!Array.isArray(window.currentStreams)) {
        window.currentStreams = [];
        return;
      }
  
      window.currentStreams.forEach((stream) => {
        if (stream.active) {
          stream.getTracks().forEach((track) => track.stop());
        }
      });
    }
  
    constructor({ cameraVideo, cameraSelect, cameraCanvas, options = {} }) {
      this.#cameraVideoElement = cameraVideo;
      this.#cameraSelectElement = cameraSelect;
      this.#cameraCanvasElement = cameraCanvas;
  
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Browser Anda tidak mendukung kamera. Coba gunakan browser yang lebih baru.');
        return;
      }
  
      this.#initialListener();
    }
  
    #initialListener() {
      this.#cameraVideoElement.oncanplay = () => {
        if (this.#streaming) return;
  
        this.#height = (this.#cameraVideoElement.videoHeight * this.#width) / this.#cameraVideoElement.videoWidth;
        this.#cameraCanvasElement.setAttribute('width', this.#width);
        this.#cameraCanvasElement.setAttribute('height', this.#height);
  
        this.#streaming = true;
        if (this.#cameraButtonElement) this.#cameraButtonElement.disabled = false;
      };
  
      this.#cameraSelectElement.onchange = async () => {
        await this.stop();
        await this.launch();
      };
    }
  
    async #populateDeviceList(stream) {
      try {
        if (!(stream instanceof MediaStream)) {
          throw new Error('MediaStream not found!');
        }
  
        const { deviceId } = stream.getVideoTracks()[0].getSettings();
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
  
        if (videoDevices.length === 0) {
          alert('Tidak ada kamera yang terdeteksi.');
        }
  
        const html = videoDevices.reduce((html, device, i) => {
          return html.concat(`
            <option value="${device.deviceId}" ${device.deviceId === deviceId ? 'selected' : ''}>
              ${device.label || `Camera ${i + 1}`}
            </option>
          `);
        }, '');
  
        this.#cameraSelectElement.innerHTML = html;
      } catch (error) {
        console.error('#populateDeviceList: error:', error);
        alert('Gagal mendapatkan daftar kamera.');
      }
    }
  
    async #getStream() {
      try {
        const deviceId =
          !this.#streaming && !this.#cameraSelectElement.value
            ? undefined
            : { exact: this.#cameraSelectElement.value };
  
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            aspectRatio: 4 / 3,
            deviceId,
          },
        });
  
        await this.#populateDeviceList(stream);
        return stream;
      } catch (error) {
        console.error('#getStream: error:', error);
        alert('Tidak bisa mengakses kamera. Pastikan Anda sudah memberi izin.');
        return null;
      }
    }
  
    async launch() {
      const stream = await this.#getStream();
      if (!stream) {
        this.#streaming = false;
        if (this.#cameraButtonElement) this.#cameraButtonElement.disabled = true;
        return;
      }
  
      this.#currentStream = stream;
      Camera.addNewStream(this.#currentStream);
  
      this.#cameraVideoElement.srcObject = this.#currentStream;
      this.#cameraVideoElement.play();
  
      this.#clearCanvas();
    }
  
    stop() {
      if (this.#cameraVideoElement) {
        this.#cameraVideoElement.srcObject = null;
        this.#streaming = false;
      }
  
      if (this.#currentStream instanceof MediaStream) {
        this.#currentStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
  
      this.#clearCanvas();
      if (this.#cameraButtonElement) this.#cameraButtonElement.disabled = true;
    }
  
    #clearCanvas() {
      const context = this.#cameraCanvasElement.getContext('2d');
      context.fillStyle = '#AAAAAA';
      context.fillRect(0, 0, this.#cameraCanvasElement.width, this.#cameraCanvasElement.height);
    }
  
    async takePhoto() {
      if (!(this.#width && this.#height && this.#streaming)) {
        alert('Kamera belum siap. Tidak bisa mengambil gambar.');
        return null;
      }
  
      const context = this.#cameraCanvasElement.getContext('2d');
      this.#cameraCanvasElement.width = this.#width;
      this.#cameraCanvasElement.height = this.#height;
  
      context.drawImage(this.#cameraVideoElement, 0, 0, this.#width, this.#height);
  
      return new Promise((resolve) => {
        this.#cameraCanvasElement.toBlob((blob) => resolve(blob));
      });
    }
  
    addCheeseButtonListener(selector, callback) {
      this.#cameraButtonElement = document.querySelector(selector);
      this.#cameraButtonElement.disabled = true; // default disabled
      this.#cameraButtonElement.onclick = callback;
    }
  }
  