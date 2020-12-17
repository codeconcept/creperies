import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  photo: SafeResourceUrl;
  image;

  constructor(
    private sanitizer: DomSanitizer,
    private afs: AngularFireStorage
  ) {}

  async takePicture() {
    this.image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.image && this.image.dataUrl
    );
  }

  async save() {
    console.log(this.image);
    const filePath = 'from-webcam';
    const ref = this.afs.ref(filePath);
    const file = this.dataURLtoFile(this.image.dataUrl, Date.now());
    const task = this.afs.upload(filePath, file);
  }

  // https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
  dataURLtoFile(dataUrl, filename) {
    var arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}
