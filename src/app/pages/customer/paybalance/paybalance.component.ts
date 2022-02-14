import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService, OperationService } from '../../_service/indexService';

@Component({
  selector: 'paybalance',
  templateUrl: './paybalance.component.html',
})

export class BalancePayComponent implements OnInit {
  modalHeader: string; item; busname; grup; resell; pro;
  PayBalanceForm; id
  submit: boolean;
  Make;
  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    public role: RoleService,
    private opser: OperationService,
  ) { }




  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    this.createForm();
    // console.log(this.role.getroleid())
    this.PayBalanceForm.get('pay_amt').setValue(this.item['payamt'])

  };

  async payment() {
    // console.log(this.PayBalanceForm.value)
    if (this.PayBalanceForm.invalid) {
      return;
    }
    // console.log('inside',this.PayBalanceForm.value)
    this.PayBalanceForm.value['invid'] = this.item['invid'];
    this.PayBalanceForm.value['cust_id'] = this.item['uid'];
    let paymentdata = [this.PayBalanceForm.value];

    let result = await this.opser.invoiceBalanceReceipt({ balance: paymentdata });
    // console.log("payresult", result);

    if (result) {
      const toast: Toast = {
        type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
        title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
        body: result[0]['msg'],
        timeout: 3000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (result[0]['error_msg'] == 0) {
        this.activeModal.close(true);
      }
    }
  };

  createForm() {
    this.PayBalanceForm = new FormGroup({
      pay_amt: new FormControl(this.item ? this.item['isp_id'] : '',Validators.required),

    });
  }
}
