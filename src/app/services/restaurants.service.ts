import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Restaurant } from '../models/restaurant';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  url = 'restaurants';

  constructor(private afs: AngularFirestore) {}

  getRestaurants(): Observable<Restaurant[]> {
    const collectionRef = this.afs.collection(this.url);
    return collectionRef.valueChanges({ idField: 'id' }) as Observable<
      Restaurant[]
    >;
  }

  getRestaurantsByTown(town: string): Observable<Restaurant[]> {
    const collectionRef = this.afs.collection<Restaurant[]>(this.url, (ref) =>
      ref.where('address.town', '==', town)
    );
    return collectionRef
      .valueChanges({ idField: 'id' })
      .pipe(tap((res) => console.log('RestaurantsService res', res))) as Observable<Restaurant[]>;
  }
}
