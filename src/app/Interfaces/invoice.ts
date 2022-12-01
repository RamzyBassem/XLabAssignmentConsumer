import { InvoiceDetails } from "./invoice-details";

export interface Invoice {

        invoiceID:string;
        invoiceNumber:any;
        clientName:string;
        createdDate:Date;
        invoice_Details:InvoiceDetails[]
    
}
