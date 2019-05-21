import {Component, Injectable, OnInit} from '@angular/core';
import {HttpService} from '../../app/http.service';
import {SocketService} from '../../app/socket.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
    selector: 'app-header',
    styleUrls:['./header.css'],
    templateUrl: './header.component.html'    
})

export class HeaderComponent implements OnInit {    
	search_bar = false;
	show_search_results = false;
    searchAble = true;
	is_content_search = false;
	content_search = false;
    search_key_word = '';
    global_search = true;
    search_results = {
        meetings : [],
        resources: [],
        topics: [],
        surveys: [],
        committees:[],
        documents: [],
        users: [],
        votings: [],
		signature_doc: [],
		resourse_doc:[],
		topic_doc:[],
		meeting_doc:[],
        home_doc:[],
        voting_doc:[]
    };
    no_search = false;
    route_map={
        'calendar.event':{
            model: '/meeting/',
            type: 'meetings'
        },
        'meeting_point.topic': {
            model:'/topic/',
            type: 'topics'
        },
        'meeting_point.folder':{
            model:'/resource/',
            type: 'resource'
        },
        'meeting_point.committee': {
            model: '/committee/',
            type: 'committee'
        },
        'survey.survey': {
            model: '/survey/',
            type: 'survey'
        },
        'meeting_point.document':{
            model: '/signature/doc/',
            type: 'document'
        },
        'meeting_point.files': {
            model: '/resource/doc/',
            type: 'document'
        },
        'meeting_point.doc':{
            model: '/meeting/doc/',
            type: 'document'
        },
        'meeting_point.topicdoc':{
            model: '/topic/doc/',
            type: 'document'
        },
		'meeting_point.news.doc':{
			model: '/home/doc/',
			type: 'document'
		},
        'meeting_point.users':{
            model: '/profile/',
            type: 'user'
        },
        'meeting_point.voting':{
            model: '/voting/',
            type: 'voting'
        }
    };

    socketService : any
    constructor(private router: Router, private sserv : SocketService, private route: ActivatedRoute, private httpService: HttpService) {
        this.socketService = sserv;
        this.route.data.subscribe(data => {
            if(!data.searchAble) {
                this.searchAble = false;
            }
        });
    }

    search(){
        let obj_this = this;
    	obj_this.content_search = obj_this.is_content_search;
        obj_this.search_results = {
            meetings : [],
            resources: [],
            topics: [],
            surveys: [],
            committees:[],
            documents: [],
            users: [],
            votings: [],
			signature_doc: [],
			resourse_doc:[],
			topic_doc:[],
			meeting_doc:[],
            home_doc:[],
            voting_doc:[]
        };
        let url = window.location + '';
        obj_this.search_key_word = obj_this.search_key_word.replace(/[^a-zA-Z0-9 ]/g, '');
        if(obj_this.search_key_word.length < 1) {
            return;
        }
        else {
            
            

            var success_cb = function (result) {
				$('.searchbar-full-width').hide();
				if(obj_this.content_search){
					result.forEach(item => {
						item['route'] = obj_this.route_map[item.model].model + item.id + '/' + obj_this.search_key_word;
						item['type'] = obj_this.route_map[item.model].type;

						item.route.indexOf('signature') != -1 ? obj_this.search_results.signature_doc.push(item): null;
						item.route.indexOf('resource') != -1 ? obj_this.search_results.resourse_doc.push(item): null;
						item.route.indexOf('meeting') != -1 ? obj_this.search_results.meeting_doc.push(item): null;
						item.route.indexOf('topic') != -1 ? obj_this.search_results.topic_doc.push(item): null;
                        item.route.indexOf('home') != -1 ? obj_this.search_results.home_doc.push(item): null;
                        item.route.indexOf('voting') != -1 ? obj_this.search_results.voting_doc.push(item): null;
					});
				}
				else {
					result.forEach(item => {
						item['route'] = obj_this.route_map[item.model].model + item.id;
						item['type'] = obj_this.route_map[item.model].type;

						item.type === 'meetings' ? obj_this.search_results.meetings.push(item) : null;
						item.type === 'topics' ? obj_this.search_results.topics.push(item) : null;
						item.type === 'resource' ? obj_this.search_results.resources.push(item) : null;
						item.type === 'committee' ? obj_this.search_results.committees.push(item) : null;
						item.type === 'survey' ? obj_this.search_results.surveys.push(item) : null;
						item.type === 'document' ? obj_this.search_results.documents.push(item) : null;
                        item.type === 'user' ? obj_this.search_results.users.push(item) : null;
                        item.type === 'voting' ? obj_this.search_results.votings.push(item) : null;
					});
				}
                if(result.length < 1) {
                    obj_this.no_search = true;
                }
                else{
                	obj_this.no_search = false;
				}
                obj_this.show_search_results = true;
                //console.log(obj_this.search_results)
            };
            var failure_cb = function (error) {
            };

            let req_url = '/meeting_point/search-json';
            this.content_search ? req_url = '/meeting_point/search-docs':null ;

            let input_data = { kw: obj_this.search_key_word, is_content_search: obj_this.is_content_search };
            let search_model = '';
            if(this.searchAble && !this.global_search) {
                if(url.indexOf('meetings') !== -1 ){
                    input_data['model'] = 'calendar.event';
                } else if(url.indexOf('resources') !== -1 ) {
                    input_data['model'] = 'meeting_point.folder';
                } else if(url.indexOf('committees') !== -1 ) {
                    input_data['model'] = 'meeting_point.committee';
                } else if(url.indexOf('profiles') !== -1 ) {
                    input_data['model'] = 'meeting_point.users';
                }
                else if(url.lastIndexOf('voting') !== -1){
                    input_data['model'] = 'meeting_point.voting';
                }
            }
            else {
                input_data['model'] = '';
            }
            let args = {
                app: 'meetings',
                model: 'Abstract',
                method: 'search'
            };
            if(obj_this.content_search )
            {
                args.method = 'search_contents'
            }
            let final_input_data = {
                args: args,
                params: input_data,
            }
            this.httpService.get(final_input_data, success_cb, failure_cb);
        }
    }

    logout(){
        var obj_this = this;
        window['current_user'].logout(1);
    }
    
    change_cursor()
    {
        //console.log(322);
        window['functions'].change_cursor();
    }
    show_profile_menu(e){
        var togglerelated = window['functions'].togglerelated;        
        togglerelated(e, this, '.profile-menu.dropdown-menu');
    }

    admin_url = '';
    ngOnInit() {
        var obj_this = this;
    	$(document).click(function (event) {
    		if(obj_this.show_search_results && !$(event).closest('.show_search_results').length){
				obj_this.show_search_results = false;
			}
		})
    }
}
