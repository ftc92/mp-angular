import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "../../app/http.service";
import { DomSanitizer } from '@angular/platform-browser';
import { SocketService } from 'src/app/socket.service';

@Component({
    styleUrls:['./commiteedetails.css'],
    templateUrl: 'commiteedetails.component.html'
})
export class CommitteeDetailsComponent implements OnInit {
    committee: any;
    img: string = 'http://pngimg.com/uploads/folder/folder_PNG8773.png';
    params: any;
    next = '';
    prev = '';
    socketService: SocketService;

    constructor(private httpService: HttpService, private route: ActivatedRoute
        , private sanitizer: DomSanitizer
        , private ss: SocketService
    ) {        
        this.socketService = this.ss;
        this.route.params.subscribe(params => this.get_data());
    }

    get_data()
    {
        var obj_this = this;
        let id = obj_this.route.snapshot.params.id;
            
        let args = {
            app: 'meetings',
            model: 'Committee',
            method: 'get_detail'
        }
		let input_data = {
            params: {id: id},
            args: args
        };   
        obj_this.httpService.get(input_data,
            (result) => {
                obj_this.committee = result.committee;
                obj_this.next = result.next;
                obj_this.prev = result.prev;
                obj_this.committee.description = obj_this.sanitizer.bypassSecurityTrustHtml(obj_this.committee.description);
            }, false);
    }

    next_prev(id){        
        var obj_this = this;
        let args = {
            app: 'meetings',
            model: 'Committee',
            method: 'get_detail'
        }
		let input_data = {
            params: {id: id},
            args: args
        }; 
        obj_this.httpService.get(input_data,
            (result) => {
                obj_this.committee = result.committee;
                obj_this.next = result.next;
                obj_this.prev = result.prev;
                obj_this.committee.description = obj_this.sanitizer.bypassSecurityTrustHtml(obj_this.committee.description);
            }, false);
    }

    ngOnInit() {
        
    }
}
