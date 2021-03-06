import {CommentsComponent} from "../components/comments/comments.component";

declare var $: any;

import { NgModule } from '@angular/core';
import { Routes, Router,RouterModule, NavigationStart, NavigationEnd} from '@angular/router';

import { AuthGuard } from './auth.guard';
import { PageNotFound } from './pagenotfound';

import {SocketService} from './socket.service';

import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';

import { ForgotpasswordComponent } from '../components/forgotpassword/forgotpassword.component';

import { CommitteesComponent } from '../components/committees/committees.component';
import { CommitteeDetailsComponent } from '../components/committeedetails/commiteedetails.component';
import { MeetingsComponent } from '../components/meetings/meetings.component';
import { MeetingDetailsComponent } from '../components/meetingdetails/meetingdetails.component';
import { ProfileDetailsComponent } from '../components/profiledetails/profiledetails.component';
import { ProfilesComponent } from '../components/profiles/profiles.component';
import { ResourcesComponent } from '../components/resources/resources.component';
import { ResourceDetailsComponent } from '../components/resourcedetails/resourcedetails.component';

import { SurveyComponent } from '../components/survey/survey.component';
import { TopicsComponent } from '../components/topics/topics.component';
import { DocumentComponent } from '../components/document/document.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { SetpasswordComponent } from '../components/setpassword/setpassword.component';
import { SigndocComponent } from 'src/components/signdoc/signdoc.component';
import { ChatComponent } from 'src/components/chat/chat.component';
import {MessengerComponent} from "../components/messenger/messenger.component";
import { VotingdetailsComponent } from '../components/votingdetails/votingdetails.component';
import { VotingresultsComponent } from "src/components/votingresults/votingresults.component";
import { RecordEditComponent } from '../components/recordedit/recordedit.component';
import { VotingsComponent } from '../components/votings/votings.component'
import { EsignDocsComponent } from "src/components/esigndocs/esigndocs.component";
import { EsignDocDetailsComponent } from "src/components/esigndocdetails/esigndocdetails.component";
import { RtcComponent } from '../components/rtc/rtc.component';
import { SurveysComponent } from '../components/surveys/surveys.component'

const appRoutes: Routes = [    
    { path: 'login', component: LoginComponent},
    { path: 'logout', component: LoginComponent},
    
    { path: '', component: HomeComponent, canActivate: [AuthGuard]},

	{ path: 'forgot-password', component: ForgotpasswordComponent},
	{ path: 'set-password', component: SetpasswordComponent},

	{ path: 'my-profile', component: ProfileDetailsComponent, canActivate: [AuthGuard]},	
	{ path: 'committees', data:{searchAble: true}, component: CommitteesComponent, canActivate: [AuthGuard]},
	{ path: 'profiles', data:{searchAble: true}, component: ProfilesComponent, canActivate: [AuthGuard]},
	{ path: 'resources', data:{searchAble: true}, component: ResourcesComponent, canActivate: [AuthGuard]},
	{ path: 'meetings/archived', data:{searchAble: true}, component: MeetingsComponent, canActivate: [AuthGuard]},
	{ path: 'meetings/completed', data:{searchAble: true}, component: MeetingsComponent, canActivate: [AuthGuard]},
	{ path: 'meetings/upcoming', data:{searchAble: true}, component: MeetingsComponent, canActivate: [AuthGuard]},

	{ path: 'upcoming/meeting/:id', component: MeetingDetailsComponent, canActivate: [AuthGuard]},
	{ path: 'completed/meeting/:id', component: MeetingDetailsComponent, canActivate: [AuthGuard]},
	{ path: 'archived/meeting/:id', component: MeetingDetailsComponent, canActivate: [AuthGuard]},
	{ path: 'meeting/:id', component: MeetingDetailsComponent, canActivate: [AuthGuard]},
	
    { path: 'directors', data:{searchAble: true}, component: ProfilesComponent, canActivate: [AuthGuard]},
    { path: 'admins', data:{searchAble: true}, component: ProfilesComponent, canActivate: [AuthGuard]},
    { path: 'staff', data:{searchAble: true}, component: ProfilesComponent, canActivate: [AuthGuard]},
    { path: 'admin/:id', component: ProfileDetailsComponent, canActivate: [AuthGuard]},
    { path: 'staff/:id', component: ProfileDetailsComponent, canActivate: [AuthGuard]},
    { path: 'director/:id', component: ProfileDetailsComponent, canActivate: [AuthGuard]},


	{ path: 'committees/:id', component: CommitteeDetailsComponent, canActivate: [AuthGuard]},
	{ path: 'profile/:id', component: ProfileDetailsComponent, canActivate: [AuthGuard]},
	{ path: 'resource/:id', component: ResourceDetailsComponent, canActivate: [AuthGuard]},
	{ path: 'home/meeting/:id', component: MeetingDetailsComponent, canActivate: [AuthGuard]},
	{ path: 'survey/:id', component: SurveyComponent, canActivate: [AuthGuard]},
	{ path: 'home/survey/:id', component: SurveyComponent, canActivate: [AuthGuard]},
	{ path: 'topic/:id', component: TopicsComponent, canActivate: [AuthGuard]},
	
    { path: 'signature/doc/:res_id', component: SigndocComponent, canActivate: [AuthGuard]},
    
    { path: ':doc_type/doc/:res_id', component: DocumentComponent, canActivate: [AuthGuard]},    
    { path: ':doc_type/doc/:res_id/:kw', component: DocumentComponent, canActivate: [AuthGuard]},
    { path: 'iframe/:doc_type/:res_id/:token', component: DocumentComponent},

    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
    { path: 'messenger', component: MessengerComponent, canActivate: [AuthGuard]},

    { path: 'iframe/comments/:res_modal/:res_id/:token', component: CommentsComponent},
    { path: 'comments/:res_modal', component: CommentsComponent, canActivate: [AuthGuard]},    

	{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},	
    

	{ path: 'meetings/completed/:id', component: MeetingDetailsComponent, canActivate: [AuthGuard]},
    { path: 'meetings/archived/:id', component: MeetingDetailsComponent, canActivate: [AuthGuard]},
	{ path: 'voting/:id', component: VotingdetailsComponent},
    { path: 'voting/:id/results', component: VotingresultsComponent},
    { path: 'edit/:app/:model/:id/:action', component: RecordEditComponent, canActivate: [AuthGuard]},
    { path: 'edit/:app/:model/add', component: RecordEditComponent, canActivate: [AuthGuard]},
    { path: 'votings', data:{searchAble: true}, component: VotingsComponent, canActivate: [AuthGuard]},
    { path: 'signdocs', data:{searchAble: true}, component: EsignDocsComponent, canActivate: [AuthGuard]},
    { path: 'signdoc/:id', component: EsignDocDetailsComponent, canActivate: [AuthGuard]},
    { path: 'surveys', data:{searchAble: true}, component: SurveysComponent, canActivate: [AuthGuard]},

    
    { path: 'rtc', component: RtcComponent},
	// otherwise redirect to home
	{ path: '**', component: PageNotFound }
];

var site_functions = window['functions'];

let routing_options = {
    imports: [RouterModule.forRoot(appRoutes, {useHash: true})],    
    exports: [RouterModule],
};

@NgModule(routing_options)
export class AppRoutingModule {
	constructor(private router: Router, private socketService: SocketService) {
		router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {  
                // window.history.pushState(null,'',event.url);
                socketService.init_route(event.url);                
				$('.showmouseawaybutton.active').removeClass('active');
				$('.hidemouseaway').hide();
				$('#annotated-doc-conatiner').hide();
                site_functions.showLoader('route'+event.url);
                $('body').removeClass('pdf-viewer');                
                window['pathname'] = event.url
			}
			else if (event instanceof NavigationEnd) {
                
                // var pathVal = window.location.toString().replace(window.location.origin.toString(), '');
                // if(pathVal == '/#/')
                // {
                //     window.history.pushState(null,'','/');
                // }
                // else
                // {
                //     pathVal = pathVal.replace('#/', '');
                //     window.history.pushState(null,'',pathVal);
                // }
                var next_url = event.url;
                var current_url = localStorage.getItem('current_url');
                if(!current_url)
                {
                    current_url = next_url;
                }
                localStorage.setItem('previous_url', current_url);
                localStorage.setItem('current_url', next_url);
                site_functions.hideLoader('route'+next_url);
			}
		});
	}
}
