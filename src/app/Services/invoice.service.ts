import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private _HttpClient:HttpClient) { }
  GetInvoiceByInvoiceNumber(InvoiceNumber:any){
    return this._HttpClient.get(`https://localhost:7105/api/Invoice/${InvoiceNumber}`);
  }
  CreateInvoice(Invoice:any){
    return this._HttpClient.post(`https://localhost:7105/api/Invoice/create`,Invoice)
  }
  UpdateInvoice(Invoice:any){
    return this._HttpClient.put(`https://localhost:7105/api/Invoice/Edit`,Invoice);
  }
  DeleteInvoice(InvoiceNumber:any){
    return this._HttpClient.delete(`https://localhost:7105/api/Invoice/Delete/${InvoiceNumber}`);

  }
}
