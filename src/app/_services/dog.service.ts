import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Dog } from '@app/_models';

const baseUrl = `${environment.apiUrl}/dogs`;

@Injectable({ providedIn: 'root' })
export class DogService {
  private dogSubject: BehaviorSubject<Dog>;
  public dog: Observable<Dog>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.dogSubject = new BehaviorSubject<Dog>(null);
    this.dog = this.dogSubject.asObservable();
  }

  public get dogValue(): Dog {
    return this.dogSubject.value;
  }

  getAll() {
    return this.http.get<Dog[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<Dog>(`${baseUrl}/${id}`);
  }

  create(params) {
    return this.http.post(`${baseUrl}`, params);
  }

  update(id, params) {
    return this.http.put(`${baseUrl}/${id}`, params)
      .pipe(map((dog: any) => {
        // update the current dog if it was updated
        if (dog.id === this.dogValue.id) {
          // publish updated dog to subscribers
          dog = { ...this.dogValue, ...dog };
          this.dogSubject.next(dog);
        }
        return dog;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
