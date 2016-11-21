import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../index';

import 'rxjs/add/observable/throw';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class NameListService {

  constructor(private http: Http) {}

  get(): Observable<string[]> {
    return this.http.get(`${Config.API}/api/name-list`)
      .map((res: Response) => res.json())
      .map((res: any) => res.data)
      .catch(this.handleError);
  }

  post(name: string) {
    return this.http.post(`${Config.API}/api/name-list`, {
      first_name: name
    })
    .catch(this.handleError);
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}

