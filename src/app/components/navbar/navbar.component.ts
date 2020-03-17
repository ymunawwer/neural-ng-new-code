import { Component, OnInit } from '@angular/core';
import { NodeapisService } from './../../services/nodeapis.service';

declare var $: any;


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private backendApi: NodeapisService) { }

  public contact = {

    'name': '',
    'email': '',
    'mobile': '',
    'message': ''

  };

  ngOnInit() {
  }

  submit() {

    if (this.contact.name === '' || this.contact.email === '' || this.contact.message === '' || this.contact.mobile === '') {

    alert('All Fields are required');

    return;

    }

    const pattern = /^[\+]*\d{8,13}$/;

    if (!pattern.test(this.contact.mobile)) {

      alert('invalid mobile number');

      return;

    }

    $('#exampleModal').modal('toggle');

    this.backendApi.submitContactUs(this.contact).subscribe((res) => {

    console.log(res);
    if (res.statusCode === 200) {

      alert('Thank you for your Query, We will get back to you soon');


    } else {

      alert('Error occured while send mail');

    }

    });

  }

}
