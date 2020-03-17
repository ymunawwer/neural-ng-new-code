import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

private apiData = new BehaviorSubject<any>(null);
public apiData$ = this.apiData.asObservable();

// here we set/change value of the observable
setData(data, storageItemName) {
  this.apiData.next(data);
  this.saveInStorage(data, storageItemName);
}

saveInStorage(data, storageItemName) {

  sessionStorage.setItem(storageItemName, JSON.stringify(data));
  return;

}

getSessionData(storageItemName) {

  return JSON.parse(sessionStorage.getItem(storageItemName)) ? JSON.parse(sessionStorage.getItem(storageItemName)) : null;

}

}
