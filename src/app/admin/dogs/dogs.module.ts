import { NgModule } from '@angular/core';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './dogs-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { ImageUploadComponent } from '@app/image-upload/image-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountsRoutingModule,
    ImageCropperModule
  ],
  declarations: [
    ListComponent,
    AddEditComponent,
    ImageUploadComponent
  ]
})
export class DogsModule { }
