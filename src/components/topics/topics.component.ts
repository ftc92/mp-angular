import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../app/http.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-topics',
    styleUrls:['./meetingdetails.css'],
    templateUrl: './topics.component.html'
})
export class TopicsComponent implements OnInit {
    topic = {
        lead : '',
        content: '',
        duration:'00:00',
        name: '',
        docs:[],
        votings:[],
    };
    bread_crumb = {
        items: [],
        title: ''
    };
    constructor(private httpService: HttpService, private route: ActivatedRoute) { }

    ngOnInit() {
        const obj_this = this;
        const req_url = '/topic/details-json';
        const input_data = {id : obj_this.route.snapshot.params.id};
        const success_cb = function (result) {
            if(!result.votings)
            {
                result.votings = [];
            }
            obj_this.topic = result;
            obj_this.bread_crumb.title = obj_this.topic['name'];
            obj_this.bread_crumb.items.push({
                title: obj_this.topic['meeting_name'],
                link: '/meeting/' + obj_this.topic['meeting_id']
            });
        };
        const failure_cb = function (error) {
        };
        let args = {
            app: 'meetings',
            model: 'Topic',
            method: 'get_details'
        }			
        let final_input_data = {
            params: input_data,
            args: args
        };
        obj_this.httpService.get(final_input_data, success_cb, failure_cb);
    }
}
