import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  url = 'restaurants';

  constructor(private afs: AngularFirestore) {}

  getRestaurants(): Observable<any[]> {
    const collectionRef = this.afs.collection(this.url);
    return collectionRef.valueChanges({ idField: 'id' });
  }
}