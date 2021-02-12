import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DogService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
  id: string;
  isAddMode: boolean;
  images = [];
  loading = false;
  submitted = false;
  response: { imgPaths: '' };
  imgPathsResponse: string[];

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    neutered: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    imgPaths: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dogService: DogService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if (!this.isAddMode) {
      this.dogService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.form.patchValue(x)
          this.imgPathsResponse = x.imgPaths;
        });
    }
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.imgPathsResponse = event.imgPaths;
  }

  public createImgPath = (serverPath: string) => {
    return `http://localhost:4000/${serverPath}`;
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  get t() { return this.f.dogImages as FormArray; }
  get dogImageFormGroups() { return this.t.controls as FormGroup[]; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      console.log(this.form.value);
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createDog();
    } else {
      this.updateDog();
    }
  }

  private createDog() {
    this.form.patchValue({ imgPaths: this.response.imgPaths });
    console.log(this.form.value);

    this.dogService.create(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Dog created successfully', { keepAfterRouteChange: true });
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  private updateDog() {
    this.dogService.update(this.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
