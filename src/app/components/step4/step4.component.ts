import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { NodeapisService } from './../../services/nodeapis.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


declare var $: any;

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component implements OnInit {

  responseFromStep3;
  model_details;

  email;
  modelId;

  myJson;
  accuracy;
  featureNames;
  finalFeatureNames;
  inputFeatureValues;
  inputFeatures;
  resultResponse;
  finalResult;

  @ViewChild('jsonButton') jsonButton: ElementRef;

  constructor(private commonData: SharedDataService,
    private backendapi: NodeapisService, private router: Router, private spinner: NgxSpinnerService) {

    commonData.apiData$.subscribe(data => this.responseFromStep3 = data);

   }
  ngOnInit() {

    if (!this.responseFromStep3) {

      this.responseFromStep3 = this.commonData.getSessionData('step3Response');

    }

    /** If response is not coming from previous component then check in session storage */

    if (!this.responseFromStep3) {

      this.router.navigate(['/api']);

   }

    setTimeout(() => {
      this.jsonButton.nativeElement.click();
      }, 200);

    console.log('step2 response', this.responseFromStep3);

    this.model_details = this.responseFromStep3.data.model_details;

    this.email = this.responseFromStep3.data.email;

    this.modelId = this.model_details.model_id;

    console.log('model details', this.model_details);

    this.accuracy = this.model_details.accuracy;

    this.model_details.x_list = JSON.parse(this.model_details.x_list);

    this.model_details.y_list = JSON.parse(this.model_details.y_list);


    this.featureNames =  Object.keys(this.model_details.x_list);

    const hints = Object.values(this.model_details.hint);

    const finalFeatureNames = [];

    this.featureNames.forEach(function(key, i) {
    finalFeatureNames.push({featureName: key, hint: hints[i]});
    });

    this.finalFeatureNames = finalFeatureNames;




  }

  public makeJsonStructure(formvalues) {

    console.log(formvalues);

    this.inputFeatureValues = Object.values(formvalues.form.value);

    this.inputFeatureValues = this.inputFeatureValues.map(function(feature) {

      return feature === undefined ? '' : feature;

  });

  console.log('values', this.inputFeatureValues);

    const condition = {

      'pklfile': this.model_details.pkl_file_path,

      'dict': this.inputFeatureValues,

      'cols': this.model_details.x_list,

      'modelId': this.model_details.model_id,

      'email': this.email,

      'steps': '3'

    };


    this.myJson = condition;

  }

  // last api

  predict(formValues) {

    this.spinner.show();

    this.inputFeatureValues = Object.values(formValues.form.value);

    this.inputFeatureValues = this.inputFeatureValues.map(function(feature) {

        return feature === undefined ? '' : feature;

    });

    const inputFeatures = this.inputFeatureValues;

    for (let i = 0; i <= inputFeatures.length; i++) {

      if ( inputFeatures[i] === '' ) {

           this.spinner.hide();
           alert('All fields are required');
           return;

      }

    }
    console.log('form values', this.inputFeatureValues);

    const condition = {

      'pklfile': this.model_details.pkl_file_path,

      'dict': this.inputFeatureValues,

      'cols': this.model_details.x_list,

      'modelId': this.model_details.model_id,

      'email': this.email,

      'steps': '3'

    };

    this.myJson = condition;

    console.log('predict condition', condition);

    this.backendapi.submitStep3B(condition).subscribe((res) => {

      console.log(res);

      if (res['statusCode'] === 200) {

        this.finalResult = res['body']['result'];
        this.resultResponse = res;
        this.spinner.hide();


      } else {

        this.spinner.hide();

        alert('Sorry some error occured');

      }

    });

  }

}
