import { Step1Component } from './../../components/step1/step1.component';
import { Step2Component } from './../../components/step2/step2.component';
import { Step3Component } from '../../components/step3/step3.component';
import { Step4Component } from './../../components/step4/step4.component';
import { PitchComponent } from '../../components/pitch/pitch.component';


import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LeaderboardComponent } from '../../components/leaderboard/leaderboard.component';

const routes: Routes = [

  {path: '', component: Step1Component},
  {path: 'step2', component: Step2Component},
  {path: 'api', component: Step3Component},
  {path: 'step4', component: Step4Component},
  {path: 'pitch', component: PitchComponent },
  {path: 'leaderboard', component: LeaderboardComponent }


];

@NgModule({

  exports: [RouterModule],
  imports: [ RouterModule.forRoot(routes) ]

})

export class AppRoutingModule { }
