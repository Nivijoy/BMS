import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustService } from '../../_service/indexService';
@Component({
  selector: 'UpdateUsername',
  templateUrl: './updateusername.component.html',

})

export class UpdateUsernameComponent implements OnInit {
  submit: boolean = false; AddNasForm; datas; id; modalHeader; config;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private ser: CustService,
    private router: Router,
  ) { this.id = JSON.parse(localStorage.getItem('details')) }

  closeModal() {
    this.activeModal.close();
  }
  ngOnInit() {
    this.createForm();

  }

  async addUsername() {
    if (this.AddNasForm.invalid) {
      this.submit = true;
      return;
    }
    // console.log('qqqq')
    this.AddNasForm.value['id'] = this.id;
    let result = await this.ser.changesubsusername(this.AddNasForm.value)
    this.datas = result[0];
    // console.log(result)

    const toast: Toast = {
      type:  this.datas['error_msg'] == 0 ? 'success' : 'warning',
      title:  this.datas['error_msg'] == 0 ? 'Success' : 'Failure',
      body:  this.datas['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if ( this.datas['error_msg'] == 0) {
      this.closeModal();
      //  this.router.navigate(['/pages/cust/viewcust'])
      //  window.location.reload();
    }
  }

  createForm() {
    this.AddNasForm = new FormGroup({
      username: new FormControl('', Validators.required),

    });
  }
}