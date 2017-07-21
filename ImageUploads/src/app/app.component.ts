import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from "angularfire2/database";

import * as firebase from 'firebase';

interface FeaturedPhotoUrls {
  url1?: string;
  url2?: string
}

interface Photo {
  url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  featuredPhotoStream: FirebaseObjectObservable<FeaturedPhotoUrls>;
  photoListStream: FirebaseListObservable<Photo[]>;
  constructor(private db: AngularFireDatabase) {
    this.featuredPhotoStream = this.db.object('/photos/featured');
    this.photoListStream = this.db.list('/photos/list');
  }
  
  featuredPhotoSelected(event: any, photoName: string) {
    const file: File = event.target.files[0];

    const metaData = {'contentType': file.type};
    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/photos/featured/${photoName}`);
    const uploadTask: firebase.storage.UploadTask = storageRef.put(file, metaData);
    console.log("uploading", file.name);

    uploadTask.then( (uploadSnapshot: firebase.storage.UploadTaskSnapshot) => { 
        console.log("upload complete");
        const downloadUrl = uploadSnapshot.downloadURL;
        firebase.database().ref(`/photos/featured/${photoName}`).set(downloadUrl);
    });
  }

  photoSelectedForList(event: any) {
    const file: File = event.target.files[0];
    const metaData = {'contentType': file.type};

    const nextAvailableKey = this.photoListStream.push({}).key;
    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/photos/list/${nextAvailableKey}`);
    const uploadTask: firebase.storage.UploadTask = storageRef.put(file, metaData);
  
    uploadTask.then( (uploadSnapshot: firebase.storage.UploadTaskSnapshot) => { 
        console.log("upload complete");
        const downloadUrl = uploadSnapshot.downloadURL;
        // firebase.database().ref(`/photos/list/${nextAvailableKey}`).set(uploadSnapshot.downloadURL);
        const photo = {'url': downloadUrl};
        this.photoListStream.update(nextAvailableKey, photo);
    });
  }
}
