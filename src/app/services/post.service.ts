import { Post } from './../models/post';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';
import { ResponseFormat } from '../models/responseFormat';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private compunnalapi: string = 'http://inspirecrqa.compunnel.com/api/';

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  httpPostOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  // Handle API errors
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      //console.error('An error occurred:', error.error.message);
      errorMessage = `An Error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
      errorMessage = `Backend returned code ${error.status} , Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // return an observable with a user-facing error message
    window.alert(errorMessage);
    return throwError(errorMessage
    //  'Something bad happened; please try again later.'
    );
  };



  private approvedStatus : Observable<ResponseFormat> = this.http.get<ResponseFormat>(this.compunnalapi + 'GetApprovedStatus').pipe(
    publishReplay(3),
    refCount()
  );
  getApprovedStatus(){
    return this.approvedStatus;
  }
  private raisedBy : Observable<ResponseFormat> = this.http.get<ResponseFormat>(this.compunnalapi + 'GetRaiseBy').pipe(
    publishReplay(3),
    refCount()
  );
  getRaisedBy() {
    return this.raisedBy;
  }


  downloadFile(DocumentNameWithGuid,Id){
    return this.http.get(this.compunnalapi + 'DownloadFileFromAws?id='+Id+'&fileName='+DocumentNameWithGuid,{
      responseType: "blob",
      observe: "response",
      reportProgress: !0
  });
  }
  // Get all Posts data
  getPostsList(): Observable<ResponseFormat> {
    return this.http
      .get<ResponseFormat>(this.compunnalapi+"ChangeRequest/ProjectId/2003")
      .pipe(
      retry(1),
      catchError(this.handleError)
      )
  }

  // Get single post data by ID
  getPost(id): Observable<ResponseFormat> {
    return this.http
      .get<ResponseFormat>(this.compunnalapi + 'ChangeRequest/' + id)
      .pipe(
      retry(2),
      catchError(this.handleError)
      )
  }


  // Create a new post
  createPost(post): Observable<ResponseFormat> {
    return this.http
      .post<ResponseFormat>(this.compunnalapi + 'ChangeRequest/', post)
      .pipe(
      catchError(this.handleError)
      )
  }


  // Update post by id
  updatePost(id, post): Observable<ResponseFormat> {
    return this.http
      .put<ResponseFormat>(this.compunnalapi + 'ChangeRequest/' + id, post)
      .pipe(
      catchError(this.handleError)
      )
  }


  // Delete post by id
  deletePost(id):Observable<ResponseFormat>{
    return this.http
      .delete<ResponseFormat>(this.compunnalapi + 'ChangeRequest/' + id, this.httpOptions)
      .pipe(catchError(this.handleError))
  }
  deleteFile(DocumentNameWithGuid,Id):Observable<ResponseFormat>{
      return this.http
        .delete<ResponseFormat>(this.compunnalapi + 'ChangeRequest/Document/'+Id+'?fileName='+DocumentNameWithGuid, this.httpOptions)
        .pipe(catchError(this.handleError));
  }

}
