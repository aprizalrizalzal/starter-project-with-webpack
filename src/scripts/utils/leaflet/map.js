import { map, tileLayer, Icon, icon, marker, popup, latLng } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import CONFIG from "../../config.js";

export default class Map {
  #zoom = 5;
  #map = null;

  // Mendapatkan nama tempat berdasarkan latitude dan longitude menggunakan MapTiler API.
  static async getPlaceNameByCoordinate(latitude, longitude) {
    if (latitude == null || longitude == null) {
      return "Lokasi tidak diketahui";
    }

    try {
      const url = new URL(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json`
      );
      url.searchParams.set("key", CONFIG.ACCESS_TOKEN_KEY);
      url.searchParams.set("language", "id");
      url.searchParams.set("limit", "1");

      const response = await fetch(url);
      const json = await response.json();

      const place = json.features[0].place_name.split(", ");
      return [place.at(-2), place.at(-1)].map((name) => name).join(", ");
    } catch (error) {
      console.error("getPlaceNameByCoordinate: error:", error);
      return `${latitude}, ${longitude}`;
    }
  }

  static isGeoLocationAvaliable() {
    return "geolocation" in navigator;
  }

  // Mendapatkan posisi saat ini menggunakan Geolocation API.
  static getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!Map.isGeoLocationAvaliable()) {
        reject("Geolocation API tidak didukung");
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  // Membuat instance Map baru secara asinkron.
  static async build(selector, options = {}) {
    const Mataram = [-8.585310105584256, 116.09825140820938];

    if ("center" in options && options.center) {
      return new Map(selector, options);
    }

    if ("locate" in options && options.locate) {
      try {
        const position = await Map.getCurrentPosition();
        const coordinate = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        return new Map(selector, {
          ...options,
          center: coordinate,
        });
      } catch (error) {
        console.error("build: error:", error);
        
        return new Map(selector, {
          ...options,
          center: Mataram,
        });
      }
    }

    return new Map(selector, {
      ...options,
      center: Mataram,
    });
  }

  // Konstruktor untuk menginisialisasi peta.
  constructor(selector, options = {}) {
    this.#zoom = options.zoom ?? this.#zoom;

    const tileOsm = tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      }
    );

    this.#map = map(document.querySelector(selector), {
      zoom: this.#zoom,
      scrollWheelZoom: false,
      layers: [tileOsm],
      ...options,
    });
  }

  // Mengubah tampilan kamera pada peta.
  changeCamera(coordinate, zoomLevel = null) {
    if (!coordinate) {
      console.error("changeCamera: Lokasi tidak ada.");
      return;
    }

    if (!zoomLevel) {
      this.#map.setView(latLng(coordinate), this.#zoom);
      return;
    }

    this.#map.setView(latLng(coordinate), zoomLevel);
  }

  // Mendapatkan pusat peta saat ini.
  getCenter() {
    const { lat, lng } = this.#map.getCenter();
    return {
      latitude: lat,
      longitude: lng,
    };
  }

  // Membuat ikon kustom untuk marker.
  createIcon(options = {}) {
    return icon({
      ...Icon.Default.prototype.options,
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      ...options,
    });
  }

  // Menambahkan marker ke peta.
  addMarker(coordinates, markerOptions = {}, popupOptions = null) {
    if (!coordinates || coordinates[0] == null || coordinates[1] == null) {
      console.warn("Koordinat tidak valid, marker tidak akan dibuat.");
      return null;
    }

    if (typeof markerOptions !== "object") {
      throw new Error("markerOptions harus berupa objek");
    }

    const newMarker = marker(coordinates, {
      icon: this.createIcon(),
      ...markerOptions,
    });

    if (popupOptions) {
      if (typeof popupOptions !== "object") {
        throw new Error("popupOptions harus berupa objek");
      }

      if (!("content" in popupOptions)) {
        throw new Error("popupOptions harus menyertakan properti `content`.");
      }

      const newPopup = popup(coordinates, popupOptions);
      newMarker.bindPopup(newPopup);
    }

    newMarker.addTo(this.#map);

    return newMarker;
  }

  // Menambahkan event listener ke peta.
  addMapEventListener(eventName, callback) {
    this.#map.addEventListener(eventName, callback);
  }
}
