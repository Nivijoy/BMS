import { Component, OnInit } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustService } from '../../_service/indexService';
import * as JSXLSX from 'xlsx';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { AddSuccessComponent } from '../success/add-success.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngx-bulkupdate',
  templateUrl: './bulkupdate.component.html',
  styleUrls: ['./bulkupdate.component.scss']
})
export class BulkupdateComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false; bulkUpdateForm; submit: boolean = false;
  bulk = []; failure: any[]; arrayBuffer: any; file: any[]; service; bulk_meta: any;config;
  constructor(
    private cust: CustService,
    private alert: ToasterService,
    public activeModal: NgbModal,


  ) { }

  ngOnInit() {
    this.createForm()
  }

  metaData(val) {
    if (val == 1) {
      this.bulk_meta = [
        { msg: 'Please Fill Login id', label: 'ProfileId', assign_to: 'profileid', required: true },
        { msg: 'Please Fill Expiry Date', label: 'ExpiryDate', assign_to: 'expiry', required: true },
      ]
    }
    return this.bulk_meta;
  }

  async bulkUpdate() {
    this.submit = true;
    if (this.bulkUpdateForm.invalid || this.bulk.length == 0) {
      window.alert('Please Select any one Service or upload file');
      return;
    }
    // console.log('file', this.bulk, '/n', this.bulkUpdateForm.value['format'])

    let value = this.bulkUpdateForm.value['format'];
    if (value == 1) {
      let result = this.metaData(value)
      for (var i = 0; i < this.bulk.length; i++) {
        for (let meta of result) {
          console.log('Bulk Value', this.bulk[i], 'Meta', meta)
          if (meta.required && !this.bulk[i].hasOwnProperty(meta.label)) {
            this.toastalert(meta.msg);
            return;
          } else {
            switch (meta.label) {
              case 'ExpiryDate':
                this.bulk[i][meta.assign_to] = new Date((this.bulk[i][meta.label] - (25567 + 2)) * 86400 * 1000)
                break;

              default:
                this.bulk[i][meta.assign_to] = this.bulk[i][meta.label]
                break;
            }
          }
        };
      };
      this.loading = true;
      // console.log('Bulk Value', this.bulk)
      let resp = await this.cust.bulkUpdateExpiry({ expiry: this.bulk });
      // console.log('Result-----', resp);
      if (resp) {
        this.loading = false;
        this.result_pop(resp, true);
      } else this.loading = false;
    }
  }

  result_pop(item, flag) {
    const activeModal = this.activeModal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Result';
    activeModal.componentInstance.item = item;
    activeModal.componentInstance.limit_flag = flag;
    activeModal.result.then((data) => {

    });
  }

  changeListener(file) {
    this.file = file;
    this.filereader(this.file, result => {
      this.bulk = result;
    });
  }

  filereader(file, callback) {
    if (file) {
      let fileReader = new FileReader(), filedata;
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = JSXLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        // console.log(JSXLSX.utils.sheet_to_json(worksheet,{raw:true}));
        callback(JSXLSX.utils.sheet_to_json(worksheet, { raw: true }))
      }
      fileReader.readAsArrayBuffer(file);
    } else {
      callback([])
    }
  }

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }


  createForm() {
    this.bulkUpdateForm = new FormGroup({
      format: new FormControl('', Validators.required)
    })
  }

}
