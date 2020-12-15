import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Restaurant } from '../models/restaurant';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  url = 'restaurants';

  constructor(private afs: AngularFirestore) {}

  getRestaurants(): Observable<Restaurant[]> {
    const collectionRef = this.afs.collection(this.url);
    return collectionRef.valueChanges({ idField: 'id' }) as Observable<Restaurant[]>;
  }
}
