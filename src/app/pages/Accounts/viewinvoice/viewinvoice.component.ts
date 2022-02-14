import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { Router } from '@angular/router';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { AccountService } from '../../_service/indexService';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfmake.vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import htmltoPdfmake  from 'html-to-pdfmake'

@Component({
  selector: 'viewinvoice',
  templateUrl: './viewinvoice.component.html',
  styleUrls: ['./viewinvoice.component.css']
})

export class ViewInvoiceComponent implements OnInit {
  modalHeader: string; invdata; views;
  submit: boolean; cuser: any = []; data; receiptdata; rcptvalue; paystatus; username; invperiod;
  show_inv = 1;

  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('content') content: ElementRef;

  public downloadAsPDF() {
    // const pdfTable = document.getElementById('pdfTable');
    // html2canvas(pdfTable).then((canvas) => {
    //   console.log('CANVAS', canvas)
    //   var imgData = canvas.toDataURL('image/png')
    //   var doc = new jsPDF();
    //   var imgHeight = canvas.height * 200 / canvas.width

    //   doc.addImage(imgData, 5, 15, 200, imgHeight)
    //   doc.save("image1.pdf")
    // });

    const pdfTable = document.getElementById('pdfTable');
    html2canvas(pdfTable).then((canvas) => {
        
        var imgData = canvas.toDataURL('image/png')
        // var doc = new jsPDF();
        // var imgHeight = canvas.height * 200 / canvas.width
        var pdf = new jsPDF("p", "mm", "a4");
        var imgData = canvas.toDataURL('image/png', 1.0);
        // due to lack of documentation; try setting w/h based on unit
        pdf.addImage(imgData,17, 15, 170, 270);   // 180x150 mm @ (10,10)mm
        // doc.addImage(imgData, 0, 0, 200, imgHeight)
        pdf.save("Invoice.pdf")
    });
  }

  constructor(
    private router: Router,
    private ser: AccountService,
    public activeModal: NgbActiveModal,

  ) { }

  async ngOnInit() {
    // console.log(this.invdata)
    if (this.invdata) {
      await this.view();
    }
  }

  closeModal() {
    this.activeModal.close();
  }
  // generatePdf() {
  //   var dd = {
  //     content:
  //       document.getElementById('main_cont').innerHTML
  //   }

  //   const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
  //   pdfmake.createPdf(dd).download();
  // }
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('main_cont').innerHTML;
    popupWin = window.open();
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Tax Invoice</title>
          
          <style>
          @media print {
            @page { margin: 0; }
            body { margin: 1cm; }
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  async view() {
    if (this.views == 2 || this.views == 4) {
      let result = await this.ser.showGSTInvoiceReceipt({ invid: this.invdata, ref_flag: 1 })
      // console.log("gstinv",result);
      if (result) {
        this.data = result[0][0];
        this.receiptdata = result[1];
        this.paystatus = this.data['pay_status']
      }
    }
    if (this.views == 1 || this.views == 3) {
      let result = await this.ser.showInvoiceReceipt({ invid: this.invdata, ref_flag: 1 })
      // console.log("invres",result);
      if (result) {
        this.data = result[0][0];
        this.receiptdata = result[1];
        this.paystatus = this.data['pay_status']
      }
    }
  }
}