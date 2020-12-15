import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Restaurant } from '../models/restaurant';
import { RestaurantsService } from '../services/restaurants.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  restaurants$: Observable<Restaurant[]>;

  constructor(private rs: RestaurantsService) {}

  ngOnInit() {
    this.getRestaurants();
  }

  getRestaurants() {
    this.restaurants$ = this.rs.getRestaurants().pipe(tap(console.log));
  }
}
