import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {Router} from '@angular/router';
import { NodeapisService } from './../../services/nodeapis.service';
import { SharedDataService } from './../../services/shared-data.service';
import { NgxSpinnerService } from 'ngx-spinner';



declare var $: any;

@Component({
 selector: 'app-step1',
 templateUrl: './step1.component.html',
 styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit {


 selectedFile: File = null;
 fileError: any = null;

 step1Form = new FormGroup({
   email: new FormControl(''),
   file: new FormControl(''),
 });


 constructor(private backendapi: NodeapisService,
  private sharedData: SharedDataService, private router: Router, private spinner: NgxSpinnerService ) { }

 ngOnInit() {



 }

 public fileSelected(files) {

   this.selectedFile = files[0];

   console.log('file selected', this.selectedFile);

   if (this.selectedFile && (this.selectedFile.type === 'text/csv' ||
       this.selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {

    if (this.selectedFile.size <= 20000000) {

      this.fileError = null;

     } else {

      this.fileError = 'csv/xlsx file should be less than 20mb';
      this.selectedFile = null;

     }

   } else {

    this.selectedFile = null;
    this.fileError = 'only csv and xlsx file accepted';

   }

 }

 onSubmit() {

  this.spinner.show();

  if (this.step1Form.value.email !== '' &&  this.selectedFile) {

    if (!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(this.step1Form.value.email))) {
      alert('Invalid Email format');
      this.spinner.hide();
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('email', this.step1Form.value.email);
    formData.append('steps', '1');

    this.backendapi.submitStep1(formData).subscribe((res) => {

      console.log(res);

      if (res.statusCode === 200) {

        this.sharedData.setData(res.body, 'step1Response');

        this.spinner.hide();

        this.router.navigate(['/step2']);

      } else {

        this.spinner.hide();


        if (res.errodCode === 500) {

          alert(res.message);

         } else {

          alert(res.message.msg);

           }

      }


    });

  } else {

    this.spinner.hide();

    alert('All fields required');

  }

 }



}


