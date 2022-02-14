import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService, CustService, S_Service, OperationService, PaymentService, RoleService } from '../../_service/indexService';
import { AddSuccessComponent } from './../success/add-success.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';

@Component({
  selector: 'Renew Customer',
  templateUrl: './renewCust.component.html',
  styleUrls: ['./renewCust.component.scss'],
})

export class RenewCustComponent implements OnInit {
  submit: boolean = false; RenewSubsForm; modalHeader; servtype; pack; subser; id;
  subpack; datas; item; packc; expdate; lastpack; lastsubplan; sstatus; cu_date; expirydate; curentdate;
  sched_date;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private alert: ToasterService,
    private router: Router,
    private activeModal: NgbActiveModal,
    private activemodal: NgbModal,
    private busser: BusinessService,
    private payser: PaymentService,
    private serv: S_Service,
    private custser: CustService,
    private opser: OperationService,
    private role: RoleService,

  ) { }

  closeModal() {
    // console.log(this.item)
    this.activeModal.close(true);
    // this.router.navigate(['/pages/cust/viewcust']);

  }

  async ngOnInit() {
    this.createForm();
    await this.Service();
    await this.previouspack();
    // console.log("cdate",this.item.cdate)
    this.expdate = new Date(this.item.edate)
    this.expdate.setTime(Math.floor((this.expdate.getTime()) + (5 * 3600 * 1000 + 1800000)))
    this.expirydate = ((this.expdate).toISOString()).slice(0, 16);
    // console.log(this.expdate);

    this.cu_date = new Date();
    this.cu_date.setTime(Math.floor((this.cu_date.getTime()) + (5 * 3600 * 1000 + 1800000)))
    this.curentdate = ((this.cu_date).toISOString()).slice(0, 16);
    // console.log('cdate',curentdate);
    if (this.expirydate <= this.curentdate) {
      this.RenewSubsForm.get('schedule_date').setValue(this.curentdate);
      this.RenewSubsForm.get('renew_type').setValue(1);
    } else {
      // console.log("edate",this.expirydate);
      this.RenewSubsForm.get('schedule_date').setValue(this.expirydate);
    }
  }

  async previouspack() {
    if (this.sstatus == 1) {
      console.log('Pack Value', this.pack)
      this.lastpack = await this.pack.filter(item => item.sstatus == 1).map(item => item.srvid);
      // this.RenewSubsForm.get('last_pack').setValue(this.lastpack)
      this.RenewSubsForm.get('srv_id').setValue(Number(this.lastpack))
      this.subplanshow();
    }
  }

  async Service($event = '') {
    // console.log('like',$event);
    let res = await this.serv.showServiceName({ rflag: 1, u_id: this.item.cust_id, cdate: this.item.cdate, like: $event })
    this.pack = res;
    // console.log(res)
    this.sstatus = this.pack.filter(item => item.sstatus == 1).map(item => item.sstatus);
  }

  async subplanshow($event = '') {
    this.RenewSubsForm.get('sub_plan_id').setValue('')
    let result = await this.serv.showSubPlan({ rflag: 1, srvid: this.RenewSubsForm.value['srv_id'], cdate: this.item.cdate, u_id: this.item.cust_id, like: $event })
    this.subpack = result;
    // console.log(result)
    let spstatus = this.subpack.filter(item => item.spstatus == 1).map(item => item.spstatus);
    if (spstatus == 1) {
      this.lastsubplan = this.subpack.filter(item => item.spstatus == 1).map(item => item.id);
      this.RenewSubsForm.get('sub_plan_id').setValue(Number(this.lastsubplan))
      this.packcal()
    }
  }

  async Renewsubs() {

    // console.log(this.RenewSubsForm.value)
    if (this.RenewSubsForm.invalid) {
      this.submit = true;
      return;
    }

    console.log("inside", this.RenewSubsForm.value)
    if (this.packc[0].service_type == 3 || this.packc[0].service_type == 5 || this.packc[0].service_type == 7 || this.packc[0].service_type == 8) {
      if (window.confirm("Invoice cancellation is disabled for this services, Are you sure want to continue ?")) {
        await this.packrenewal();
      } else {
        this.closeModal();
      }
    }
    if (this.packc[0].service_type == 1 || this.packc[0].service_type == 2 || this.packc[0].service_type == 4 || this.packc[0].service_type == 6) {
      if (window.confirm("Are you sure want to continue ?")) {
        await this.packrenewal();
      } else {
        this.closeModal();
      }
    }



  }

  async packrenewal() {
    this.loading = true;
    this.RenewSubsForm.value['cust_id'] = this.item.cust_id;
    this.RenewSubsForm.value['role'] = this.item.role;
    this.RenewSubsForm.value['c_date'] = this.item.cdate;
    let renewaldata = [this.RenewSubsForm.value]
    console.log('Loading', this.loading)
    let result = await this.opser.subscriber_renewal({ renewal: renewaldata })
    this.loading = false;

    console.log('Loading', this.loading)
    // this.datas = result;
    console.log('Result', result);
    // if(result) this.loading = false;
    let res = result[0]
    if (res.error_msg == 0) {
      this.closeModal();
    }
    if (result) {
      this.result_pop(result);
    }
    console.log('Loading', this.loading)


  }

  paidamount() {
    if (this.RenewSubsForm.value['pay_status'] == 2) {
      this.RenewSubsForm.get('pay_amt').setValue(Number(this.packc[0]['base_amount']) + Number(this.packc[0]['tax_amount']))
    }

  }

  async packcal() {
    // console.log(this.RenewSubsForm.value['sub_plan_id'])
    this.packc = this.subpack.filter(item => item.id == this.RenewSubsForm.value['sub_plan_id'])
    // console.log('asd',this.packc)
    await this.paidamount();

  }

  async schedulecal() {
    if (this.RenewSubsForm.value['renew_type'] == 2) {
      this.sched_date = new Date(this.RenewSubsForm.value['schedule_date']);
      if (this.packc[0]['type'] == 0) {
        const days = this.packc[0]['time_unit'] + this.packc[0]['additional_days']
        this.sched_date.setDate(this.sched_date.getDate() + days);
      } else {
        const days = this.packc[0]['additional_days']
        if (days != 0) this.sched_date.setDate(this.sched_date.getDate() + days);
        this.sched_date.setMonth(this.sched_date.getMonth() + this.packc[0]['time_unit'])
      }

    }
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

  result_pop(item) {
    const activemodal = this.activemodal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activemodal.componentInstance.modalHeader = 'Result';
    activemodal.componentInstance.item = item;
    activemodal.result.then((data) => {
    });
  }

  createForm() {
    this.RenewSubsForm = new FormGroup({
      last_pack: new FormControl(''),
      srv_id: new FormControl('', Validators.required),
      sub_plan_id: new FormControl('', Validators.required),
      pay_status: new FormControl('1', Validators.required),
      pay_date: new FormControl(''),
      renew_type: new FormControl('1', Validators.required),
      Discount: new FormControl(''),
      exp_date: new FormControl(''),
      schedule_date: new FormControl(''),
      comment: new FormControl(''),
      pay_amt: new FormControl(''),

    });
  }
}