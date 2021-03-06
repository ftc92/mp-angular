﻿import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../app/http.service';

@Component({
    styleUrls:['./resourcedetails.css'],
    templateUrl: 'resourcedetails.component.html'
})
export class ResourceDetailsComponent implements OnInit {
    folder: any;
    root = true;
    no_folders = false;
    no_files = false;

    constructor(private httpService: HttpService, private route: ActivatedRoute) {
        this.route.params.subscribe(params => this.get_data());
    }

    get_data(){
        var obj_this = this;
        const input_data = { id: this.route.snapshot.params.id };
        let args = {
            app: 'resources',
            model: 'Folder',
            method: 'get_details'
        }			
        let final_input_data = {
            params: input_data,
            args: args
        };
        obj_this.httpService.get(final_input_data,
            (result) => {                
                obj_this.root = !(result.hasOwnProperty('parent_id'));
                obj_this.folder = result;
                const parents = result.parents;
                if (parents && parents.length > 0) {
                    parents.reverse();
                    parents[parents.length - 1]['is_last'] = 1888;
                }
                obj_this.folder.files.length > 0 ? obj_this.no_files = false : obj_this.no_files = true;
                obj_this.folder.sub_folders.length > 0 ? obj_this.no_folders = false : obj_this.no_folders = true;
        }, (error: any) => {
            console.log(error);
            //alert(error);
        });
    }

    ngOnInit() {                        
    }

}
