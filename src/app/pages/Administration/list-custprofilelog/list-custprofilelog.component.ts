import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleService, AdminuserService, CustService, BusinessService, SelectService, PagerService } from '../../_service/indexService';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';


@Component({
  selector: 'list-custprofilelog',
  templateUrl: './list-custprofilelog.component.html',
  styleUrls: ['./list-custprofilelog.component.scss']
})

export class ListCustProfileLogComponent implements OnInit {
  tot; proid; custlog; search; user_name = '';

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  constructor(
    private router: Router,
    private adminser: AdminuserService,
    private select: SelectService,
    private custser: CustService,
    public role: RoleService,
    public pageservice: PagerService,
    private datePipe: DatePipe
  ) { }

  async user($event = '') {
    this.proid = await this.custser.showUser({ like: $event })
    // console.log("proid",res)
  }

  async ngOnInit() {
    localStorage.removeItem('array');
    await this.initiallist();
    await this.user();
  }

  async initiallist() {
    this.loading = true;
    let result = await this.adminser.listCustProfileLog(
      {
        index: (this.page - 1) * this.limit,
        limit: this.limit,
        u_id: this.user_name
      });
    // console.log(result)
    if (result) {
      this.custlog = result[0];
      this.tot = result[1]['count']
    }
    this.loading = false;
    this.setPage();
  }

  getlist(page) {
    var total = Math.ceil(this.tot / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    }
  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.tot, this.page, this.limit);
    this.pagedItems = this.custlog;
    // console.log('asdfg',this.pagedItems)
  }

  async download() {
    let res = await this.adminser.listCustProfileLog({});
    if (res) {
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        if (this.role.getroleid() >= 775) {
          param['RESELLER BUSINESS NAME'] = temp[i]['company'];
        }
        param['SUBSCRIBER NAME'] = temp[i]['cust_name'];
        param['SUBSCRIBER PROFILEID'] = temp[i]['profile_id'];
        temp[i]['from_date'] = this.datePipe.transform(temp[i]['rfrom'], 'd MMM y h:mm:ss a')
        param['FROM DATE'] = temp[i]['from_date'];
        temp[i]['to_date'] = this.datePipe.transform(temp[i]['rto'], 'd MMM y h:mm:ss a')
        param['TO DATE'] = temp[i]['to_date'];

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'CustProfile Log' + EXCEL_EXTENSION);
    }
  }

}