import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService, CustService, S_Service, OperationService, RoleService, PaymentService } from '../../_service/indexService';
import { AddSuccessComponent } from './../success/add-success.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'subsrenewal',
  templateUrl: './subsrenewal.component.html'
  // styleUrls:['./custstyle.scss'],
})

export class SubsRenewalComponent implements OnInit {
  submit: boolean = false; SubsRenewForm; config; modalHeader; servtype; pack; subser; id;condition;
  subpack; datas; item; packc; expdate; lastpack; lastsubplan; sstatus; cu_date; expirydate; curentdate;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  
  constructor(
    private alert: ToasterService,
    private router: Router,
    private activemodal: NgbModal,
    private busser: BusinessService,
    private serv: S_Service,
    private custser: CustService,
    private opser: OperationService,
    private payser : PaymentService,
    private role: RoleService,

  ) { }



  async ngOnInit() {
    this.createForm();
    await this.Service();
    await this.previouspack();

    var edate = window.localStorage.getItem('subsexp_date');
    this.expdate = new Date(edate)
    this.expdate.setTime(Math.floor((this.expdate.getTime()) + (5 * 3600 * 1000 + 1800000)))
    this.expirydate = ((this.expdate).toISOString()).slice(0, 16);
    // console.log(this.expdate);

    this.cu_date = new Date();
    this.cu_date.setTime(Math.floor((this.cu_date.getTime()) + (5 * 3600 * 1000 + 1800000)))
    this.curentdate = ((this.cu_date).toISOString()).slice(0, 16);
    // console.log('cdate',this.curentdate);
    if (this.expirydate <= this.curentdate) {
      this.SubsRenewForm.get('schedule_date').setValue(this.curentdate);
      this.SubsRenewForm.get('renew_type').setValue(1);
    } else {
      // console.log("edate",this.expirydate);
      this.SubsRenewForm.get('schedule_date').setValue(this.expirydate);
    }
      
      
  }

  async previouspack() {
    if (this.sstatus == 1) {
      this.lastpack = await this.pack.filter(item => item.sstatus == 1).map(item => item.srvid);
      // this.SubsRenewForm.get('last_pack').setValue(this.lastpack)
      this.SubsRenewForm.get('srvid').setValue(Number(this.lastpack))
      this.subplanshow();
    }
  }

  async Service($event = '') {
    // console.log($event);
    let res = await this.serv.showServiceName({ rflag: 1, like: $event })
    this.pack = res;
    // console.log(res)
    this.sstatus = this.pack.filter(item => item.sstatus == 1).map(item => item.sstatus);
  }

  async subplanshow($event = '') {
    this.SubsRenewForm.get('sub_plan_id').setValue('')
    let result = await this.serv.showSubPlan({ rflag: 1, srvid: this.SubsRenewForm.value['srvid'], like: $event })
    this.subpack = result;
    // console.log(result)
    let spstatus = this.subpack.filter(item => item.spstatus == 1).map(item => item.spstatus);
    if (spstatus == 1) {
      this.lastsubplan = this.subpack.filter(item => item.spstatus == 1).map(item => item.id);
      this.SubsRenewForm.get('sub_plan_id').setValue(Number(this.lastsubplan))
      this.packcal()
    }
  }

  async Renewsubs() {
    // console.log(this.SubsRenewForm.value)
    if (this.SubsRenewForm.invalid) {
      this.submit = true;
      return;
    }
    this.SubsRenewForm.value['cust_id'] = this.role.getsubid();
    this.SubsRenewForm.value['role'] = this.role.getroleid();
  
    let renewaldata = [this.SubsRenewForm.value]
    // let result = await this.opser.subscriber_renewal({ renewal: renewaldata })
    let result = await this.payser.payment(this.SubsRenewForm.value);
    console.log("result",result);
    result = JSON.parse(result);
    // console.log("result",JSON.parse(result));
    
    const div = document.createElement('div');
    div.innerHTML = result['ldata'];
    while (div.children.length > 0) {
      document.body.appendChild(div.children[0])
    }
    const form:any = document.getElementById("f1");
    // console.log('form',form)
    form.submit();
    // console.log(result);
    //  let res = result[0]
    // if (result) {
    //   this.result_pop(result, 1);
    // }
  }

  packcal() {
    // console.log(this.SubsRenewForm.value['sub_plan_id'])
    this.packc = this.subpack.filter(item => item.id == this.SubsRenewForm.value['sub_plan_id'])
    // console.log('asd',this.packc)

  }

  toastalert(msg, status = 0) {
    const toast: Toast = {
      type: status == 1 ? 'success' : 'warning',
      title: status == 1 ? 'Success' : 'Failure',
      body: msg,
      timeout: 2000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
  }

  result_pop(item, subs) {
    const activemodal = this.activemodal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activemodal.componentInstance.modalHeader = 'Result';
    activemodal.componentInstance.item = item, subs;
    activemodal.result.then((data) => {
    });
  }

  createForm() {
    this.SubsRenewForm = new FormGroup({
      last_pack: new FormControl(''),
      srvid: new FormControl(''),
      sub_plan_id: new FormControl(''),
      // pay_status: new FormControl('1'),
      pay_date: new FormControl(''),
      pay_type: new FormControl('1'),
      Discount: new FormControl(''),
      exp_date: new FormControl(''),
      schedule_date: new FormControl(''),
      comment: new FormControl(''),
      pay_amt: new FormControl(''),

    });
  }
}