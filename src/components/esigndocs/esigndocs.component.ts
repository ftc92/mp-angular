﻿import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../app/http.service';
import { Router } from '@angular/router';
declare var $:any;

@Component({
    styleUrls:['./esigndocs.css'],
    templateUrl: 'esigndocs.component.html'
})
export class EsignDocsComponent implements OnInit {
    docs = [];

    constructor(private httpService: HttpService,public router: Router,) {        
        this.get_data();
    }
    uploadClick(){
        console.log('yyyyyyyyyyyyyyyyyyyyy ');
        $('#esign_upload').click();
	}

    addFile(event){
		const obj_this = this;
		var element = event.target;
		// console.log(element)
		var file = element.files[0];
		var fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = function () {
            console.log(fileReader)
            let final_input_data = {
            params: {name:file.name,file:fileReader.result},
            args: {
                app: 'meetings',
                model: 'SignDocument',
                method: 'save_doc'
            }
            };
            obj_this.httpService.post(final_input_data,
            (result: any) => {
            // obj_this.docs = result.records;
            obj_this.router.navigate([`/signdoc/${result.id}`]);

            },
            (error: any) => {
                //console.log(error);
            });   
		};
		fileReader.onerror = function (error) {
			console.log('Error: ', error);
		};
	}

    get_data()
    {
        const obj_this = this;        
        let args = {
            app: 'meetings',
            model: 'SignDocument',
            method: 'get_records'
        }			
        let final_input_data = {
            params: {},
            args: args
        };
        obj_this.httpService.get(final_input_data,
        (result: any) => {
            obj_this.docs = result.records;
            obj_this.httpService.count = result.count;
            obj_this.httpService.total_records = result.total;

        },
        (error: any) => {
            //console.log(error);
            //alert(error);
        });      
        
    }

    ngOnInit() {
    }
}
