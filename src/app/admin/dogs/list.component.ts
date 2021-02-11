import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { DogService } from '@app/_services';
import { Dog } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  dogs: any[];

  constructor(private dogService: DogService) { }

  ngOnInit() {
    this.dogService.getAll()
      .pipe(first())
      .subscribe(dogs => this.dogs = dogs);
  }

  deletedog(id: string) {
    const dog = this.dogs.find(x => x.id === id);
    dog.isDeleting = true;
    this.dogService.delete(id)
      .pipe(first())
      .subscribe(() => {
        this.dogs = this.dogs.filter(x => x.id !== id)
      });
  }
}
