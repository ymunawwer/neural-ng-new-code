import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ENV } from '../core/env.config';

@Injectable({
  providedIn: 'root'
})
export class NodeapisService {

  constructor(private http: HttpClient) { }

  /*

  handling error from backend and handling network error.

  */

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      alert(error.message);
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }

  /*

  Step1 post request.

  */

  submitStep1(data): Observable<any> {

    return this.http.post(ENV.step1, data).pipe(
      catchError(err => this.handleError(err))
    );

  }


  /*

  Step2 post request.

  */

 submitStep2(data): Observable<any> {
console.log(data);
  return this.http.post(ENV.step2, data).pipe(
    catchError(err => this.handleError(err))
  );

}

/*

  Step3A post request.

  */

 submitStep3A(data): Observable<any> {

  return this.http.post(ENV.step3A, data).pipe(
    catchError(err => this.handleError(err))
  );

}

/*

  Step3B post request.

  */

 submitStep3B(data): Observable<any> {

  return this.http.post(ENV.step3B, data).pipe(
    catchError(err => this.handleError(err))
  );

}

 submitContactUs(data): Observable<any> {

  return this.http.post(ENV.contactus, data).pipe(
    catchError(err => this.handleError(err))
  );

 }


 selectAlgo(data): Observable<any> {

  return this.http.post(ENV.select_algo, data).pipe(
    catchError(err => this.handleError(err))
  );

 }


 saveData(data): Observable<any> {

  return this.http.post(ENV.save_data, data).pipe(
    catchError(err => this.handleError(err))
  );

 }

 reBuild(data): Observable<any> {

  return this.http.post(ENV.reBuild, data).pipe(
    catchError(err => this.handleError(err))
  );

 }

}
