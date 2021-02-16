import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';


@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class ImageUploadComponent implements OnInit {

  public progress: number;
  public message: string;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public fileToReturn: Blob;

  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  fileChangeEvent(event: any): void {

    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    let File = base64ToFile(this.croppedImage);
    this.fileToReturn = File;
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let filesToUpload: File[] = files;
    const formData = new FormData();

    formData.append('file' + 0, this.fileToReturn, "grim.png");
    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file' + index + 1, file, file.name);
    });

    this.http.post('http://localhost:4000/Image', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      });
  }
}
