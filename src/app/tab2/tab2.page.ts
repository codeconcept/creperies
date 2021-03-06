import { Component } from '@angular/core';
import * as L from 'leaflet';
import * as GeoSearch from 'leaflet-geosearch';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Address } from '../models/address';
import { Restaurant } from '../models/restaurant';
import { RestaurantsService } from '../services/restaurants.service';

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
  searchProvider;
  restaurants$: Observable<Restaurant[]>;
  towns = ['Rennes', 'Liffré'];
  markers = [];

  constructor(private rs: RestaurantsService) {}

  ionViewDidEnter() {
    this.createMap();
    this.addSearch();
  }

  createMap() {
    const rennes = { lat: 48.117266, lng: -1.6777926 };
    const zoomLevel = 12;
    // to prevent "map container is already initialized" error
    if (!this.map) {
      this.map = new L.Map('map').setView([rennes.lat, rennes.lng], zoomLevel);
    }

    const tileLayerURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    // const tileLayerURL = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    const mainLayer = L.tileLayer(tileLayerURL, {
      minZoom: 12,
      maxZoom: 17,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

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
    console.log(this.map.markers);
  }

  addMarker({ coords, text, open }) {
    const marker = L.marker([coords.lat, coords.lng], { icon: this.smallIcon });
    this.markers = [marker, ...this.markers];
    console.log('addMarker | marker', marker);
    if (open) {
      marker.addTo(this.map).bindPopup(text).openPopup();
    } else {
      marker.addTo(this.map).bindPopup(text);
    }
  }

  addSearch() {
    this.searchProvider = new GeoSearch.OpenStreetMapProvider();
    const search = new GeoSearch.GeoSearchControl({
      provider: this.searchProvider,
    });
    this.map.addControl(search);
  }

  async searchAndMark(address: Address, restaurantName: string) {
    const formattedAddress = `${address.town}, ${address.street}, ${address.zipcode}`;
    const result = await this.searchProvider.search({
      query: formattedAddress,
    });
    console.log(result);
    const firstResult = result[0];
    const popupText = `${restaurantName} - ${address.street} - ${address.zipcode} ${address.town}`;
    const markerOptions = {
      coords: { lat: firstResult.y, lng: firstResult.x },
      text: popupText,
      open: false,
    };
    console.log('markerOptions', markerOptions);
    this.addMarker(markerOptions);
  }

  addMarkersForTown(town: string): void {
    console.log('change!', town);
    // delete all markers that are there due to previous search
    this.deleteMarkers();
    this.restaurants$ = this.rs.getRestaurantsByTown(town).pipe(
      tap((result) => {
        result.forEach((restau) => {
          this.searchAndMark(restau.address, restau.name);
        });
      })
    );
  }

  deleteMarkers() {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
  }
}
