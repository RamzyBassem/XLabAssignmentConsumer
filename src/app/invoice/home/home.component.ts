import { Component, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Invoice } from 'src/app/Interfaces/invoice';
import { InvoiceDetails } from 'src/app/Interfaces/invoice-details';
import { InvoiceService } from 'src/app/Services/invoice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  invoice: any = <Invoice>{};
  invoieDetails: InvoiceDetails[] = []
  searchInvoiceNumber: any;
  errorMessage: string = "";
  detailsCounter: number = 0;
  successMessage:string="";
  totalPrice:number=0;
  constructor(public invoiceService: InvoiceService) {
  }

  ngOnInit(): void {
    this.InitializeInvoiceDetails();
  }

  InitializeInvoiceDetails() {   // initalizes all the variables
    this.invoieDetails[0] = <InvoiceDetails>{};
    this.invoieDetails[1] = <InvoiceDetails>{};
    this.invoieDetails[2] = <InvoiceDetails>{};
    this.invoieDetails[3] = <InvoiceDetails>{};
    this.invoice=<Invoice>{};
    this.detailsCounter = 0;
    this.totalPrice = 0;

  }
  Search() {  // search for a specific invoice
    this.InitializeInvoiceDetails();  
    if (this.searchInvoiceNumber != undefined && this.searchInvoiceNumber != "") {   
      this.errorMessage = "";
      this.successMessage = "";
      this.invoiceService.GetInvoiceByInvoiceNumber(this.searchInvoiceNumber).subscribe(     
        (respone) => {
          console.log(respone)
          this.invoice = respone;
          this.invoice.createdDate = new Date(this.invoice.createdDate);  
          for(let i =0;i<4;i++){                  // 
            if(this.invoice.invoice_Details[i])
               this.invoieDetails[i] = this.invoice.invoice_Details[i];

          }
          this.errorMessage = "";
          this.getproductsCount();  
        },
        (error) => {
          console.log(error)
          this.errorMessage = "No Invoice Found with this Number";
        }

      )
    }
    else {
      this.errorMessage = "Please Enter A Number To Search For"
    }
  }
  reset() {
    //(<HTMLFormElement>document.getElementById("form")).reset();
    this.searchInvoiceNumber = undefined;
    this.errorMessage = "";
    this.successMessage = "";
  }
  getproductsCount() {   // get products count , it iterate on the 4 elements if any elements contains all three data then its a valid product
    this.detailsCounter = 0;
    this.totalPrice = 0;
    this.invoieDetails.forEach(element => {
      if (element.price && element.productName && element.quantity) {
        this.detailsCounter++;
        this.totalPrice+=element.price * element.quantity;
      }

    });
  }
  validateDetails() {   // this method validates if fields are entered or not 
    this.errorMessage = "";
    let hasNull = false;
    let hasValue = false;
    let validator = true;
    this.invoieDetails.forEach(element => {    // iterate over the four products if any products has one / two columns entered and missing
      // another column then a message appear that you must enter all fields
      if (element.price || element.productName || element.quantity) {
        hasValue = true;
      }
      if (!element.price || !element.productName || !element.quantity) {
        hasNull = true;
      }
      if (hasNull == hasValue && hasNull == true) {
        this.errorMessage = "enter all fields"
        validator = false;
      }
      hasNull = false;
      hasValue = false
    });
    if (!this.invoice.invoiceNumber || !this.invoice.clientName || !this.invoice.createdDate) {
      this.errorMessage = "enter all fields"
      validator = false;

    }
    return validator;
  }
  insert() { 
    let validator = this.validateDetails();
    if (validator == true) {
      this.invoice.invoice_Details = []

      this.invoieDetails.forEach(element => {
        if (element.price) {
          element.invoiceID = this.invoice.invoiceID;
          this.invoice.invoice_Details.push(element);
        }
      });
      this.invoiceService.CreateInvoice(this.invoice).subscribe(
        (respone) => {
          console.log(respone)
          this.successMessage="Added Successfully "
        },
        (error) => {
          console.log(error)
          if(error.status=400){
            this.errorMessage="Invoice with this Invoice Number Already Exists !"
          }
        }


      )
    }


  }
  update(){
    let validator = this.validateDetails();
    if(!this.invoice.invoiceID){
      this.errorMessage="You Need to Search for the Invoice to Update it"
    }
   else if (validator == true) {
      this.invoice.invoice_Details = []

      this.invoieDetails.forEach(element => {
        if (element.price) {
          element.invoiceID = this.invoice.invoiceID;
          if(!element.invoice_DetailsID)
             element.invoice_DetailsID='00000000-0000-0000-0000-000000000000'
          this.invoice.invoice_Details.push(element);
        }
      });
      this.invoiceService.UpdateInvoice(this.invoice).subscribe(
        (respone) => {
          console.log(respone)
          this.successMessage="Updated Successfully "
        },
        (error) => {
          console.log(error)
            this.errorMessage=error.error
          
        }


      )


    }
  }
  delete(){
    this.invoiceService.DeleteInvoice(this.invoice.invoiceNumber).subscribe(
      (respone) => {
        console.log(respone)
        this.successMessage="Deleted Successfully "
      },
      (error) => {
        console.log(error)
          this.errorMessage="Not Found"
        
      }


    )
  }
}
