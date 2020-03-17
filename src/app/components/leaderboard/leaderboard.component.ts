import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { NgForm } from '@angular/forms';
import { NodeapisService } from './../../services/nodeapis.service';
import {Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  public responseFromStep2;

  public whicToDeploy;

  public algorithms;

  public finalAlgorithms;

  public tt_split;

  public sending_tt_split;

  public parameterValues;

  public algo_params;

  public formValues;

  constructor(private commonData: SharedDataService,
    private backendApi: NodeapisService, private router: Router,
    private spinner: NgxSpinnerService) {

    commonData.apiData$.subscribe(data => this.responseFromStep2 = data);

  }

  ngOnInit() {



    if (!this.responseFromStep2) {

      this.responseFromStep2 = this.commonData.getSessionData('step2Response');

    }

    console.log('response', this.responseFromStep2);

    this.tt_split = this.responseFromStep2.tt_split;

    this.algorithms = this.responseFromStep2.algo_hyper;

    const accuracyArray = [];

    const algorithms = this.algorithms;

    for (const algo in algorithms) {

      if (1)  {

        accuracyArray.push([algo, algorithms[algo]]);

      }

    }

     accuracyArray.sort(function(a, b) {

      return a[1].accuracy - b[1].accuracy;

    });

    accuracyArray.reverse();


    this.finalAlgorithms = accuracyArray;

    this.sending_tt_split = this.tt_split[0];



  }


  onSubmit(f: NgForm) {

    this.spinner.show();

    console.log(f.value);  // { first: '', last: '' }

    const formValue = f.value;

    const algo_params = {};

    Object.keys(this.algorithms).forEach(function (algo) {

      const hyper_object = {};

      if (f.value[algo] === true) {

        for (const key in f.value) {
          if (f.value.hasOwnProperty(key)) {

            if (key.includes(algo)) {

              const hyperParameter = key.slice(algo.length, key.length);
              if (hyperParameter !== '') {

                hyper_object[hyperParameter] = f.value[key];

              }

            }

          }
        }

        algo_params[algo] = hyper_object;
        console.log('local algo params', algo_params);

      }


    });

    this.algo_params = algo_params;

    console.log('public algo params', this.algo_params);

    console.log(algo_params);

    const data = {

      email: this.responseFromStep2.email,
      modelId: this.responseFromStep2.model_id,
      filePath: this.responseFromStep2.file_path,
      fileExtension: this.responseFromStep2.file_extension,
      x_list: this.responseFromStep2.x_list,
      y_list: this.responseFromStep2.y_list,
      algo: this.responseFromStep2.algo,
      tt_split: this.sending_tt_split,
      algo_params: algo_params
    };

    console.log('final data', data);

    this.backendApi.reBuild(data).subscribe((res) => {

      console.log('response', res);

      if (res.statusCode === 200) {

        this.spinner.hide();

        this.algorithms = res.body.algo_hyper;

        const algorithms = this.algorithms;

        const accuracyArray = [];

    for (const algo in algorithms) {

      if (1)  {

        accuracyArray.push([algo, algorithms[algo]]);

      }

    }

     accuracyArray.sort(function(a, b) {

      return a[1].accuracy - b[1].accuracy;

    });

    accuracyArray.reverse();

    console.log('accuracy array', accuracyArray);

    const self = this;

    for ( const key in self.finalAlgorithms ) {

      if (self.finalAlgorithms.hasOwnProperty(key)) {

        self.finalAlgorithms[key][1]['accuracy'] = 'a';

    }

    }

    this.finalAlgorithms = accuracyArray;

        console.log('updated', this.algorithms);

      } else {

        alert('Error occured');

        this.spinner.hide();


      }

    });


  }

  deploy() {

    console.log('algo params', this.algo_params);

    console.log('which to deploy', this.whicToDeploy);

    let algo_params = {};

    const self = this;

    for (const key in self.algo_params) {

      if (key === self.whicToDeploy) {

       algo_params[key] = self.algo_params[key];

      }

    }

    console.log('final algo params', algo_params);

    this.spinner.show();

    const data = {

      filePath: this.responseFromStep2.file_path,

      fileExtension: this.responseFromStep2.file_extension,

      email: this.responseFromStep2.email,

      modelId: this.responseFromStep2.model_id,

      x_list: this.responseFromStep2.x_list,

      y_list: this.responseFromStep2.y_list,

      prediction_type: 'custom',

      algo: this.whicToDeploy,

      algo_params: algo_params,

      deploy: 'True',

      tt_split: this.sending_tt_split


    };

    console.log('deploy data', data);

    this.backendApi.selectAlgo(data).subscribe((res) => {

      console.log(res);

      if (res['statusCode'] === 200) {

        this.spinner.hide();

         this.commonData.setData(res['body'], 'step2Response2');

        this.router.navigate(['/api']);


      } else {

        this.spinner.hide();

        alert(res['message'].msg);

      }

    });

  }

  onSelectionChange(algo) {

    console.log('algo', algo);

    this.whicToDeploy = algo[0];

  }


}
