import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  map = null;
  // retrieve from https://gist.github.com/ThomasG77/61fa02b35abf4b971390
  smallIcon = new L.Icon({
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  constructor() {}

  ionViewDidEnter() {
    this.createMap();
  }

  createMap() {
    const rennes = { lat: 48.117266, lng: -1.6777926 };
    const zoomLevel = 14;
    // to prevent "map container is already initialized" error
    if(!this.map) {
      this.map = new L.Map('map').setView([rennes.lat, rennes.lng], zoomLevel);
    }

    const tileLayerURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    // const tileLayerURL = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const mainLayer = L.tileLayer(
      tileLayerURL,
      {
        minZoom: 12,
        maxZoom: 17,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    mainLayer.addTo(this.map);
    const descriptionWikipedia = `
    Rennes est une commune de l'Ouest de la France, chef-lieu du département d’Ille-et-Vilaine et de la région Bretagne. 
    La ville se situe en Haute-Bretagne — partie orientale de la Bretagne — à la confluence de l’Ille et de la Vilaine. 
    Ses habitants sont appelés les Rennais et les Rennaises.

    Située sur l'arc atlantique européen, à 55 kilomètres des côtes de la Manche, Rennes compte 216 815 habitants intra-muros, 
    ce qui fait d'elle la première ville de la région Bretagne, 
    la deuxième ville du Grand Ouest 
    et la onzième commune la plus peuplée de France en nombre d'habitants`;
    const popupOptions = {
      coords: rennes,
      text: descriptionWikipedia,
      open: false,
    };
    this.addMarker(popupOptions);
  }

  addMarker({ coords, text, open }) {
    const marker = L.marker([coords.lat, coords.lng], { icon: this.smallIcon });
    if (open) {
      marker.addTo(this.map).bindPopup(text).openPopup();
    } else {
      marker.addTo(this.map).bindPopup(text);
    }
  }
}
