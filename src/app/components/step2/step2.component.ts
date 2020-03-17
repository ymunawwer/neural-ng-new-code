import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { NodeapisService } from './../../services/nodeapis.service';
import {Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


declare var $: any;

@Component({
 selector: 'app-step2',
 templateUrl: './step2.component.html',
 styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit {

 responseFromStep1;
 x_list;
 y_list;
 algo = [];
 tt_split;
 disableYFeature = true;
 disableAlgo = true;
 selectedXfeatures = [];

 public step2Form = {

   'x_list': [],
   'y_list': '',
   'algo': '',
   'tt_split': '',
   'x_list_2': [],
   'prediction_type': ''

   };

 constructor(private commonData: SharedDataService,
    private router: Router, private backendapi: NodeapisService, private spinner: NgxSpinnerService) {

   commonData.apiData$.subscribe(data => this.responseFromStep1 = data);

  }

 ngOnInit() {


   $('#checkAll').click(function() {
     $('#checkboxes input:checkbox').not(this).prop('checked', this.checked);
 });
   $(document).ready(function() {
     $('#undo_redo').multiselect();
 });

   /** Get Response from other component */

   if (!this.responseFromStep1) {

     this.responseFromStep1 = this.commonData.getSessionData('step1Response');
     console.log("session data");
     console.log(this.responseFromStep1.dataTypesValues[0]);

   }

   /** If response is not coming from previous component then check in session storage */

   if (!this.responseFromStep1) {

      this.router.navigate(['']);

   }

   console.log('response', this.responseFromStep1 );

   /** Convert datatypes to array for multiple select */

   const step1Response = this.responseFromStep1;

   const dataTypesValues = Object.values(step1Response.dataTypesValues);
  
   this.x_list =  dataTypesValues;
  //  console.log("session data values");
  //    console.log(this.x_list[1]);

   this.y_list = dataTypesValues;


   /** Get tt_split values */

   this.tt_split = step1Response.tt_split;


 }


 selectionMade(value) {

 const xList = this.x_list;
 const yList = this.y_list;


 for ( let i = 0; i < value.length; i++) {

   this.selectedXfeatures.push(value[i]);
   delete xList[value[i].key];
   delete yList[value[i].key];

 }

 this.x_list = xList;

 this.y_list = yList;

 }

 selectionDeleted(value) {


   const selectedFeatures = this.selectedXfeatures;
   const xList = this.x_list;
   const yList = this.y_list;

   console.log('x list', xList);

   for ( let i = 0; i < value.length; i++) {


     for (let j = 0; j < selectedFeatures.length; j++) {

      console.log('for 2ndst');

      console.log(selectedFeatures[j].key, value[i].key);

         if (selectedFeatures[j].key === value[i].key) {

          console.log('2nd for inside if');

          console.log(selectedFeatures[j].key, value[i].key);


           this.selectedXfeatures.splice(j, 1);

           xList[value[i].key] = value[i].value;



         }

     }

     // delete xList[value[i].key];
     // delete yList[value[i].key];

   }

   console.log('x list 2', xList);


   this.x_list = xList;

   this.y_list = yList;
 }

 showAlgo(event) {

  // this.step2Form.tt_split = this.tt_split[1];
   console.log("event")
   console.log(event.value);
   console.log(this.step2Form.y_list);
  //  console.log('algos', this.responseFromStep1.algo);

   if (event.value === 'float64' || event.value === 'int64') {

    //  this.algo = this.responseFromStep1.algo.regression;

    //  this.step2Form.algo =  this.responseFromStep1.algo.regression[0];

    this.step2Form.algo = 'regression';


   } else {

    //  this.algo = this.responseFromStep1.algo.classification;

    //  this.step2Form.algo =  this.responseFromStep1.algo.classification[0];

    this.step2Form.algo = 'classification';

   }
   this.disableAlgo = false;
 }

 save() {


   this.spinner.show();

   console.log('values', this.step2Form);

   if (
    //  this.step2Form.algo === '' ||
    // this.step2Form.tt_split === '' ||
       this.step2Form.x_list.length === 0 || this.step2Form.y_list === '') {

        this.spinner.hide();
        alert('All Fields required');
        return;

   }

   console.log('new x value', this.selectedXfeatures);

   const xList = {  };

   this.selectedXfeatures.map(function(item) {

     xList[item.key] = item.value;

   });

   const yList = {  };

     yList[this.step2Form.y_list['key']] = this.step2Form.y_list['value'];



   console.log('latest console.log', yList);

   let deploy_status = 'False';

   if ( this.step2Form.prediction_type === 'auto' ) {

    deploy_status = 'False';

   } else {

    deploy_status = 'False';

   }

   const data = {

     filePath: this.responseFromStep1.filePath,

     datatypes: this.responseFromStep1.dataTypesValues,

     steps: this.responseFromStep1.steps,

     fileName: this.responseFromStep1.fileName,

     fileExtension: this.responseFromStep1.fileExtension,

     email: this.responseFromStep1.email,

     modelId: Date.now()+"-"+(Math.floor(Math.random() * 10000) + 99999),

     x_list: xList,

     y_list: yList,

     prediction_type: this.step2Form.prediction_type,

     algo: this.step2Form.algo,

     deploy: deploy_status

    //  tt_split: this.step2Form.tt_split,

    //  steps: '2'

   };

   console.log(data);
  //  this.sharedData.setData(data, 'step2Response');
   sessionStorage.setItem("step2data", JSON.stringify(data));
   
   

   this.backendapi.saveData(data).subscribe((res) => {
    

     console.log(res);

     if (res['statusCode'] === 200) {

      if (res.body['prediction_type'] === 'auto') {

        this.commonData.setData(res['body'], 'step2Response2');

       this.spinner.hide();

       this.router.navigate(['/api']);


      } else {

       this.commonData.setData(res['body'], 'step2Response');

       this.spinner.hide();

       this.router.navigate(['/leaderboard']);

      }

     } else {

       this.spinner.hide();

       alert(res['message'].msg);

     }

   });


 }




}


