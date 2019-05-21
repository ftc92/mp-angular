import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { HttpService } from '../../app/http.service';
import { SocketService } from '../../app/socket.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
    styleUrls:['./home.css'],
    templateUrl: 'home.component.html'    
})
export class HomeComponent implements OnInit {
    welcome: boolean;
    calendar: boolean;
    to_do: boolean;
    to_do_data = false;
    to_do_count = 0;
    survey_name = '';
    date: Number = Date.now();
    home_data: any;
    events = [];
    surveyDetails = {};
    survey_show: boolean;
    socket;

    constructor(private httpService: HttpService,
        public router: Router,
        private sanitizer: DomSanitizer,
        private socketService: SocketService) {
        this.welcome = true;
        this.calendar = false;
        this.to_do = false;
        this.survey_show = false
        this.home_data = {
            doc_ids: [],
            photo: '',
            news : {},
            to_do_items: {}

        }
        $('#collapsibleNavbar').children().eq(0).addClass('active');
    }

    getSurveyDetails(id: any, name: string) {
        this.survey_name = name;
        let obj_this = this;
        let args = {
            app: 'survey',
            model: 'Question',
            method: 'get_records'
        }			
        let input_data = {
            params: {
                survey_id: id
            },
            args: args
        };
        this.httpService.get(input_data,
            (result: any) => {
                obj_this.surveyDetails['questions'] = result;
                obj_this.surveyDetails['survey_id'] = id;
                obj_this.toggle_Survey();
            },null);
    }

    toggle_Survey() {
        this.welcome = false;
        this.calendar = false;
        this.survey_show = !this.survey_show;
        this.to_do = !this.to_do;
    }

    onSelectionChange(entry: any, question: any) {
        this.surveyDetails['questions'].forEach((ques: any) => {
            if (ques.id === question.id) {
                ques['answer'] = entry.toString();
            }
        })
    }

    submit_survey() {
        let obj_this = this;
        var questions = obj_this.surveyDetails['questions'];
        questions = JSON.stringify(questions);
        
        let args = {
            app: 'survey',
            model: 'Survey',
            method: 'submit'
        }
		let input_data = {
            params: {
                survey_id: obj_this.surveyDetails['id'],
                questions: questions 
            },
            args: args
        }; 
        this.httpService.post(input_data,
            (data: any) => {
                console.log(data);
                this.ngOnInit();
                this.toggle_Survey();
            },
            (error: any) => {})
    }

    show_welcom(index) {
        $('#to-do').hide();
        $('#collapsibleNavbar').children().removeClass('active');
        $('#collapsibleNavbar').children().eq(index).addClass('active');
        this.welcome = true;
        this.calendar = false;
        document.getElementById('calendar').style.display = 'none';
        this.to_do = false;
        this.survey_show = false;
    }    

    show_calendar(index) {
        $('#to-do').hide();
        let obj_this = this;
        $('#collapsibleNavbar').children().removeClass('active');
        $('#collapsibleNavbar').children().eq(index).addClass('active');
        document.getElementById('calendar').style.display = 'block';
        obj_this.welcome = false;
        obj_this.to_do = false;
        obj_this.survey_show = false;
        obj_this.calendar = true;
        let home_data = obj_this.home_data;
        var events = [];
        if (obj_this.events.length != 0) {
            events = obj_this.events;
        } else {
            if (home_data.calendar) {
                home_data.calendar.forEach(function(event: any) {
                    let date = window['functions'].meeting_time_str(event.start);
                    events.push({
                        title: event.name,
                        start: event.start,
                        stop: event.stop,
                        date: date,
                        id: event['id'],
                        my_event: event['my_event']
                    })
                });
                obj_this.events = events;
            }
        }
        if (home_data.calendar)
            obj_this.renderCalendar(events);
    }

    show_to_do(index) {
        $('#collapsibleNavbar').children().removeClass('active');
        $('#collapsibleNavbar').children().eq(index).addClass('active');
        this.welcome = false;
        this.calendar = false;
        document.getElementById('calendar').style.display = 'none';
        this.survey_show = false;
        $('#to-do').show();
    }

    renderCalendar(events) {
        let obj_this = this;
        
        $('#calendar').fullCalendar({
            events: events,
            eventClick: function (calEvent, jsEvent, view) {
                var id = calEvent.id;
                var req_url = '/meeting/summary'

                let args = {
                    app: 'meetings',
                    model: 'Event',
                    method: 'meeting_summary'
                }
                let input_data = {
                    params: {
                        id: id
                    },
                    args: args
                }; 
                obj_this.httpService.get(input_data,
                    (data: any) => {
                        if(data)
                        if(typeof(data) != "string"){
                            obj_this.render_CalendarEvnetPopup(data);
                        }
                    }
                , null);
            },
            header:
            {
                left: 'year,month,agendaWeek,agendaDay',
                center: 'title'
            }, // buttons for switching between views
            eventLimit: true, // for all non-agenda views
            // views: {
            //     agenda: {
            //         eventLimit: 6 // adjust to 6 only for agendaWeek/agendaDay
            //     }
            // }
        });
    
        if ($('.fc-schedule-button').length == 0) {
            var schedule_html = '<div class="container-fluid schedule-container schedule-wrap">';      
            for (var i = 0; i < events.length; i++) {
                if (events[i]['my_event']) {
                    schedule_html += '<div event_id='+events[i].id+' class="scheduleDetailOpener row">';
                    // schedule_html += '<div class="col"> <span>' + events[i].date[1] + ' ' + events[i].date[0] +','+ events[i].date[2]+'</span></div>';
                    schedule_html += '<div class="col"> <span>' + events[i].date +'</span></div>';
                    schedule_html += '<div class="col">'+ window['functions'].hour_minutes(new Date(events[i].start)) + ' - ' + window['functions'].hour_minutes(new Date(events[i].stop)) + '</div>';
                    schedule_html += '<div class="col">' + events[i].title + '</div>';
                    schedule_html += '</div>'
                }
            }
            schedule_html += '</div>';
            let schedule = $(schedule_html);
            schedule.find('.scheduleDetailOpener').click(function(){
                obj_this.scheduleDetails(this);
            });
            var btn = $('<button type="button" class="fc-schedule-button fc-button fc-state-default fc-corner-right">Schedule</button>')
            $('.fc-button-group:first').append(btn);
    
            btn.click(function showSchedule() {
                $('.schedule-container').show();
                $('.fc-view-container').empty().html(schedule);
                $('.fc-prev-button').hide();
                $('.fc-next-button').hide();
                $('.fc-center').hide();
                $('.fc-today-button').hide();
                $('.fc-state-active').removeClass('fc-state-active');
                btn.addClass('fc-state-active');
            });
        }
    }

    scheduleDetails(el)
    {
        let obj_this = this;
        var event_id = $(el).attr('event_id');    
        var req_url = '/meeting/summary'
        
        let args = {
            app: 'meetings',
            model: 'Event',
            method: 'meeting_summary'
        }
        let input_data = {
            params: {
                id: event_id
            },
            args: args
        }; 
        obj_this.httpService.get(input_data,
            (data: any) => {
                if(data)
                if(data)
                if(typeof(data) !="string"){
                    obj_this.render_CalendarEvnetPopup(data);
                }
            },
            (error: any) => {})
    };

    render_CalendarEvnetPopup(result)
    {
        let obj_this = this;
        var event_summary = $('#event-summary');    
        var calendar_modal = $('#calenderModal');
        var upcoming_buttons = event_summary.find('.upcomingButton');        
        result.start = window['functions'].meeting_time_str(result.start)
        result.stop = window['functions'].meeting_time_str(result.stop);
        if (result.my_event)
        {
            calendar_modal.find('.go_details').attr('id', result.id).show();
            upcoming_buttons.show();
            event_summary.find('.upcomingButton').show();
            if(result.attendee_status)
            {            
                upcoming_buttons.find('.fa-check').remove();
                upcoming_buttons.find('span[name="'+result.attendee_status+'"]').before('<i class="fa fa-check fa-lg" style="color:white" modifiers="{}"></i>');
            }
        }
        else
        {
            calendar_modal.find('.go_details').attr('id', 0).hide();
            upcoming_buttons.hide();
        }
        
        function calLocation(result){
            result['location'] = '';        
            result.location = result.location;
        }
        calLocation(result);
        //console.log(result);
        event_summary.find('tr').hide();
        
        for (var key in result)
        {
            if(!result[key])
                continue;
            var span = event_summary.find('span[name="'+key+'"]');
            span.closest('tr').show();
            if(key == 'pin' || key == 'conference_bridge_number' || key == 'video_call_link')
            {
                if(result['conference_status'] != 'active')
                {
                    span.closest('tr').hide();
                    continue;
                }
                else
                {
                    if(key == 'video_call_link'){
                        var video_call_link = '/conference/'+ result['id']+'/'+ result['pin']
                        var element = span.find('a');
                        var base_url = window.location.origin.toString();
                        //base_url = base_url.slice(0,-1);
                        element.html(base_url + video_call_link);
                        element.attr('href', base_url + video_call_link);
                        span.closest('tr').show();
                        continue;
                    }
                    span.closest('tr').show();
                }                    
            }
            if(span.length > 0)
            {
                span.html(result[key]);                
            }
        }
        
        //upcoming_buttons.attr('meetingid',result.id);
        //calendar_modal.find('.modal-header:first h3');
        calendar_modal.find('.modal-header:first').find('h3').html(result.name);
        calendar_modal.find('.modal-body:first').html(event_summary.html());
        
        upcoming_buttons = calendar_modal.find('.upcomingButton:first');
    
        // calender event pop up buttons click listener
        upcoming_buttons.children().click(function(){
            var elbtn = $(this);
            var response = elbtn.find('span').attr('name');        
            upcoming_buttons.find('i').remove();
            elbtn.find('span').before('<i class="fa fa-check fa-lg" style="color:white" modifiers="{}"></i>');
            window['is_popup'] = 1;
            obj_this.respond_invitation(response, result.id)
            $('#tdmrb'+result.id).find('i').remove();                
            $('#tdmrb'+result.id).find('span[name="'+response+'"]').before('<i class="fa fa-check fa-lg" style="color:white" modifiers="{}"></i>');
        });
        calendar_modal.modal('show');
    }

    respond_invitation(response: string, meet_id: string) {
        let req_url = '/meeting/respond-invitation-json';
        let obj_this = this;
        let input_data = {
            meeting_id: meet_id,
            response: response,
            no_loader: 1
        };
        var meeting_being_updated;
        obj_this.home_data.to_do_items.pending_meetings.forEach((meeting: any) => {
            if (meeting.id === meet_id) {
                meeting_being_updated = meeting;
            }
        });
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
            obj_this.httpService.get(final_input_data, function(data) {
                if (!window['is_popup']){
                    meeting_being_updated.attendee_status = response;
                }
                else
                {
                    window['is_popup'] = 0;
                }
            }, null);
        }
    }

    navigate_meeting() {
        var obj_this = this;
        let id = document.getElementsByClassName('go_details')[0].id;
        obj_this.router.navigate(['/upcoming/meeting/' + id]);
    }

    get_home_data() {     
        var obj_this = this;
        var success_cb = function(home_data) {
            if (!home_data['to_do_items']) {
                console.log("invalid data", home_data);
                return;
            }
            home_data  = {
                news: home_data.news,
                doc_ids: home_data.doc_ids,
                video_ids: home_data.video_ids,
                to_do_items:{
                    pending_meetings: home_data.to_do_items.pending_meetings,
                    pending_surveys: home_data.to_do_items.pending_surveys,
                    pending_documents:home_data.to_do_items.pending_documents,
                    pending_votings: home_data.to_do_items.pending_votings
                },
                calendar: home_data.calendar
            };

            //console.log(home_data);
            var result = home_data.to_do_items.pending_meetings;
            for (var i in result) {
                var start = result[i]['start'];
                start = window['functions'].meeting_time(start);
                result[i]['start_dt'] = start;
            }
            
            home_data.description = obj_this.sanitizer.bypassSecurityTrustHtml(home_data.news.description);            

            var valid_videos = [];            
            home_data.video_ids.forEach((element: any) => {
                element.original_url = element.url;
                if (element.url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
                    element.url = obj_this.sanitizer.bypassSecurityTrustResourceUrl(element.url);
                    valid_videos.push(element);
                } else {
                    console.log(element.url + ' is not valid url');
                }
            });
            home_data.video_ids = valid_videos;

            obj_this.home_data = home_data;
            var to_do_items = obj_this.home_data.to_do_items;
            if (to_do_items.pending_meetings.length) {
                obj_this.to_do_data = true;

            } else if (to_do_items.pending_surveys.length) {
                obj_this.to_do_data = true;

            } else if (to_do_items.pending_documents.length) {
                obj_this.to_do_data = true;

            } else if (to_do_items.pending_votings.length) {
                obj_this.to_do_data = true;
            }
            obj_this.to_do_count = to_do_items.pending_documents.length + to_do_items.pending_meetings.length + to_do_items.pending_surveys.length + to_do_items.pending_votings.length;
        };
        let args = {
            app: 'meetings',
            model: 'News',
            method: 'get_data'
        }
		let input_data = {
            params: {},
            args: args
        };
        obj_this.httpService.get(input_data, success_cb, null);
    }

    view_video(video_name, video_url){  
        console.log(video_url); 
        $('#videoModal .modal-heaer').html('<h3>'+video_name+'</h3>')
        $('#videoModal .modal-body .embed-responsive').html(`
            <iframe class="embed-responsive-item" frameborder="0"  allowfullscreen="allowfullscreen"
             src="`+video_url+`?autoplay=1">
             </iframe>
        `);     
        $('#videoModal').modal('show');
    }

    ng_init = false;
    ngOnInit() {
        var obj_this = this;
        $('.home-container').show();
        $('#videoModal').on('hidden.bs.modal', function () {
            $('#videoModal .modal-body .embed-responsive').html('');
        });
        // $('#calenderModal').on('hidden.bs.modal', function () {
        //     $('#calenderModal .modal-body').html('');
        // });
        $('#event-summary tr').hide();
        obj_this.get_home_data(); 
        $(function(){
            obj_this.ng_init = true;
        })       
        this.socketService.server_events['to_do_item_updated'] = function() {
            if (obj_this){
                setTimeout(function(){
                    obj_this.get_home_data();
                },5000)
            }                
        }
    }
}