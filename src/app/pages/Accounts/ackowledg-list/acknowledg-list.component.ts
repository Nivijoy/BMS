import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectService, NasService, BusinessService, GroupService, RoleService, PagerService, AccountService } from '../../_service/indexService';
import { InvoiceAcknowlodgeComponent } from '../inv-acknowledge/inv-acknowledge.component';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { ViewAckInvoiceComponent } from '../viewackinvoice/viewackinvoice.component';
import { ViewQrCodeComponent } from '../viewqrcode/viewqrcode.component';
import { DatePipe } from '@angular/common';
import { ChangedateComponent } from '../changedate/changedate.component';

@Component({
  selector: 'acknowledg-list',
  templateUrl: './acknowledg-list.component.html',
  styleUrls: ['./acknowledg-list.component.scss'],
})
export class ListInvoiceAckComponent implements OnInit {
  data; totalpage = 10; pages = [1, 2, 3, 4, 5]; count; bus; bus_name; group1;
  group_name; nas1; nas_name; search;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private ser: AccountService,
    private nasmodel: NgbModal,
    private select: SelectService,
    private busser: BusinessService,
    private groupser: GroupService,
    public role: RoleService,
    public pageservice: PagerService,
    private datePipe: DatePipe

  ) { }

  ngOnInit() {
    this.initiallist();
    this.showBusName();

  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event });
  }



  async refresh() {
    this.bus_name = '';

    await this.initiallist()
  }

  async initiallist() {
    this.loading = true;
    let result = await this.ser.listEInvoicing({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
    })
    this.data = result[0];
    this.count = result[1]['count'];
    for (let l = 0; l < this.data.length; l++) {
      this.data[l].tot_amt = Number(this.data[l].inv_amt) + Number(this.data[l].inv_tax)
    }
    this.loading = false;
    this.setPage();
    // console.log(result);

  }

  getlist(page) {
    var total = Math.ceil(this.count / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    }
  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
    // console.log('asdfg',this.pagedItems)
  }

  async download() {
    let res = await this.ser.listEInvoicing({
      bus_id: this.bus_name,
    });
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() > 777) {
          param['ISP NAME'] = temp[i]['busname'];
        }
        param['SUBSCRIBER COMPANY'] = temp[i]['cust_company'];
        param['SUPPLIER GSTIN'] = temp[i]['supplier_gst_number'];
        param['RECIPIENT GSTIN'] = temp[i]['recipient_gst_number'];
        param['DOCUMENT NO'] = temp[i]['rollid'];
        temp[i]['ack_date'] = this.datePipe.transform(temp[i]['ack_date'], 'd MMM y')
        param['DOCUMENT DATE'] = temp[i]['ack_date'];
        param['TOTAL AMOUNT'] = temp[i]['total_amount'];
        param['HSN CODE'] = temp[i]['hsn'];
        param['IRN'] = temp[i]['irn'];
        temp[i]['ack_date'] = this.datePipe.transform(temp[i]['ack_date'], 'd MMM y h:mm:ss a')
        param['IRN DATE'] = temp[i]['ack_date'];
        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'EInvoicing' + EXCEL_EXTENSION);
    }
  }

  invack() {
    const activeModal = this.nasmodel.open(InvoiceAcknowlodgeComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Add InvAcknowledgment';

    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  view_inv(item) {
    const activeModal = this.nasmodel.open(ViewAckInvoiceComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'View Acknowledged Invoice';
    activeModal.componentInstance.item = { invid: item };
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  view_code(item) {
    const activeModal = this.nasmodel.open(ViewQrCodeComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'View QRCode';
    activeModal.componentInstance.item = { invid: item };
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

  change_einvoice(item) {
    const activeModal = this.nasmodel.open(ChangedateComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Update Einvoice Date';
    activeModal.componentInstance.item = { invid: item };
    activeModal.result.then((data) => {
      this.initiallist();
    });
  }

}