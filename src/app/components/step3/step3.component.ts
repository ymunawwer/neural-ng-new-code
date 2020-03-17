import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { NodeapisService } from '../../services/nodeapis.service';
import {Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


declare var $: any;

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit {

  responseFromStep2;
  email;
  modelId;

  constructor(private commonData: SharedDataService,
    private backendapi: NodeapisService, private router: Router, private spinner: NgxSpinnerService) {

    commonData.apiData$.subscribe(data => this.responseFromStep2 = data);

   }

  ngOnInit() {

    if (!this.responseFromStep2) {

      this.responseFromStep2 = this.commonData.getSessionData('step2Response2');

    }

    console.log('step2 response', this.responseFromStep2);

    this.email = this.responseFromStep2.email;

    this.modelId = this.responseFromStep2.modelId;

  }

  next() {

    this.spinner.show();

    console.log(this.email, this.modelId);

    if (this.email === '' || this.modelId === '') {

      this.spinner.hide();
      alert('All fields Required');
      return;

    }

    const data = {

      email: this.email,

      modelId: this.modelId

    };

    this.backendapi.submitStep3A(data).subscribe((res) => {

      console.log('1st result', res);

      if (res['statusCode'] === 200) {

        this.commonData.setData(res['body'], 'step3Response');

        this.spinner.hide();


        this.router.navigate(['/step4']);

      } else {

        this.spinner.hide();

        alert(res['message']);

      }

      });


  }

}
