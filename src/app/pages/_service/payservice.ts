import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PaymentService {
  constructor(
    private http: HttpClient
  ) { }

  async payment(params) {
    return await this.http.post("/api/pay/meTrnPay", params, { responseType: 'text' }).toPromise();
  }

  async paysuccess(params) {
    return await this.http.post("/api/pay/meTrnSuccess",params).toPromise();
  }

  async paystatus(params){
    return await this.http.post("/api/pay/meTrnStaus",params).toPromise();
  }

  async pumstatus(params){
    return await this.http.post("/api/pay/pumTrnStaus",params).toPromise();
  }

  async paystatusCust(params){
    return await this.http.post("/api/pay/meTrnStausSub",params).toPromise();
  }

  async pumstatusCust(params){
    return await this.http.post("/api/pay/pumTrnStausSub",params).toPromise();
  }
  
}