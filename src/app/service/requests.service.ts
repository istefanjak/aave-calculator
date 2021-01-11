import { ApiStakeData } from './../model/stake.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  endpoint: string = 'https://aave-calc.herokuapp.com/api/stake';

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get(this.endpoint).pipe(map((res: any) => {
      if (res?.code == 1) return res as ApiStakeData;
      throw new Error(res);
    }))
  }
}
