import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BatuwaService {

  constructor(
    private http: HttpClient
  ) { }


  add_to_batuw(payload: any) {
    const url = environment.HOST + '/api/v1/batuwa/add-to-batuwa';
    return this.http.post(url, payload);
  }

  get_batuw(deviceId: string) {
    const url = environment.HOST + `/api/v1/batuwa/get-batuwa?deviceId=${deviceId}`;
    return this.http.get(url);
  }

  deviceExist(device: string) {
    const url = environment.HOST + `/api/v1/batuwa/deviceId-exist?deviceId=${device}`;
    return this.http.get(url);
  }

  add_to_passKey(payload: any) {
    const url = environment.HOST + '/api/v1/batuwa/add-to-passkey';
    return this.http.post(url, payload);
  }

  auth_batuwa(deviceId: string, passKey: string) {
    const url = environment.HOST + `/api/v1/batuwa/auth-batuwa?deviceId=${deviceId}&passkey=${passKey}`;
    return this.http.get(url);
  }
}
