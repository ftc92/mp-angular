﻿import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import {SocketService} from "../../app/socket.service";
declare var $: any;

@Component({
	styleUrls:['./meetingdetails.css'],
	templateUrl: 'meetingdetails.component.html'
})

export class MeetingDetailsComponent implements OnInit {
	meeting_object: any;
	meetObjLoaded = false;
	notes = [];
	new_reply = '';
	bread_crumb = {
		items: [],
		title: ''
	};
	next = '';
	prev = '';
	meeting_type = 'upcoming';
	title = '';
	flag = '';
	first_time = true;
	me: any;
	discussion_params = {
		model:'Event',
		app:'meetings'
	}
    conference_not_active = false;
    socketService: SocketService;

	constructor(private route: ActivatedRoute,
				private router: Router,
				private httpService: HttpService,
				private sanitizer: DomSanitizer,
                private ss: SocketService) 
    {	
        this.socketService = this.ss;
        this.route.params.subscribe(params => this.get_data());
    }

	get_data() {
        let obj_this = this;
		obj_this.bread_crumb = {
			items: [],
			title: ''
		};
		const page_url = window.location + '';
		let req_peram = (window.location + '').split('/');
		obj_this.flag = req_peram[req_peram.length - 3];
		if (['upcoming', 'completed', 'archived'].indexOf(obj_this.flag) === -1) {
			obj_this.flag = '';
		}

		
        let args = {
            app: 'meetings',
            model: 'Event',
            method: 'get_details'
        }
		let input_data = {
            params: {id: obj_this.route.snapshot.params.id, meeting_type: obj_this.flag},
            args: args
        }; 

        let on_data = function(result) {
            try {
                if(result.message)
                {
                    $('#main-div').html('<h2 style="text-align:center">'+result.message+'</h2>');
                    return;
                }
                var meeting_object = obj_this.meeting_object = result.meeting;
                obj_this.next = result.next;
                obj_this.prev = result.prev;                
                if (result.meeting && result.meeting.name) {
                } else {
                    obj_this.router.navigate(['/']);
                    return;
                }
                obj_this.meeting_type = result.meeting.exectime;

                obj_this.meeting_type === 'ongoing' ? obj_this.meeting_type = 'upcoming' : obj_this.meeting_type;
                if(obj_this.meeting_type)
                {
                    obj_this.meeting_type === 'past' ? obj_this.meeting_type = 'archived' : obj_this.meeting_type;
                    obj_this.title = obj_this.meeting_type[0].toUpperCase() + obj_this.meeting_type.slice(1).toLowerCase();
                }
                
                make_bread_crumb(result.meeting.name);
                obj_this.meeting_object.description = obj_this.meeting_object.description.trim();                
                if(meeting_object.description)
                    meeting_object.description = obj_this.sanitizer.bypassSecurityTrustHtml(obj_this.meeting_object.description);
                var uid = window['current_user'].cookie.id;

                var pp = 0
                var me = undefined;
                var myindex = -1;
                var attendees = meeting_object.attendees
                attendees.forEach(att => {
                    if (att.uid == uid) {
                        myindex = pp;
                        me = att;
                    }
                    pp++;
                });
                if(!me)
                {
                    console.log('Me not in attendees');
                    return;
                }
                attendees.splice(myindex, 1);
                attendees.splice(0, 0, me);
				obj_this.me = attendees[0];
				// console.log(meeting_object.video_call_link.length);

                // meeting_object.video_call_link = '';
                // if (meeting_object.conference_status == 'active') {
                //     var curl = window.location.origin.toString();
                //     meeting_object.video_call_link = curl + '/conference/' + meeting_object.id + '/' + meeting_object.pin;
                // } else if (obj_this.meeting_type == 'upcoming') {
                //     obj_this.conference_not_active = true;
                // }
            } catch (er) {
                console.log(er);
            }
            obj_this.meetObjLoaded = true;
        };

        
		this.httpService.get(input_data, on_data, null);
		function make_bread_crumb(page_title) {
			const bread_crumb_items = obj_this.bread_crumb.items;
			// if (page_url.indexOf('home') > -1) {
			// 	bread_crumb_items.push({title: 'Home', link: '/'});
			// }
			bread_crumb_items.push({title: obj_this.title + ' Meetings', link: '/meetings/' + obj_this.meeting_type});
			if (page_title) {
				obj_this.bread_crumb.title = page_title;
			}
		}
	}

	isInProgress() {
		// var startTime = moment('8:45am', 'h:mma');
		// var endTime = moment('9:00am', 'h:mma').add(3, 'hours');
		// var now = moment();
		// if(now.isBefore(endTime) && now.isAfter(startTime))
		// console.log('In Progress!!!')
		// else
		// console.log('Finished!!')
		return true;
	}

	respond_invitation(response: string, meet_id: string) {
		let req_url = '/meeting/respond-invitation-json';
		let obj_this = this;
		let input_data = {
			meeting_id: meet_id,
			response: response,
			no_loader: 1
		};
		obj_this.meeting_object.attendee_status = response;
		obj_this.me.state = response;

		var meeting_being_updated = obj_this.meeting_object;

		if (response) {
			let args = {
                app: 'meetings',
                model: 'Event',
                method: 'respond_invitation'
            }			
            let final_input_data = {
                params: input_data,
                args: args
            };
            obj_this.httpService.get(final_input_data, function (data) {
				meeting_being_updated.attendee_status = response;
			}, null);
		}
	}

	ngOnInit() {
        
	}

	ngOnDestroy() {

	}
}
