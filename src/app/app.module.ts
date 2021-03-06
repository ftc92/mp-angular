import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';

import { FormatTimePipe } from './pipes/format-time.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { CamelCasePipe } from './pipes/camel.pipe'

import { SocketService } from './socket.service';
import { HttpService } from './http.service';

import { AppComponent }         from './app.component';
import { AppRoutingModule }     from './app-routing.module';
import { AuthGuard } from './auth.guard';
import { LoginComponent }   from '../components/login/login.component';
import { HomeComponent }   from '../components/home/home.component';
import { PageNotFound } from './pagenotfound';

import { HeaderComponent } from '../components/header/header.component';
import { ChatComponent } from '../components/chat/chat.component';

import { CommitteesComponent } from '../components/committees/committees.component';
import { CommitteeDetailsComponent } from '../components/committeedetails/commiteedetails.component';
import { ProfileDetailsComponent } from '../components/profiledetails/profiledetails.component';
import { ProfilesComponent } from '../components/profiles/profiles.component';
import { MeetingsComponent } from '../components/meetings/meetings.component';
import { MeetingDetailsComponent } from '../components/meetingdetails/meetingdetails.component'
import { ResourcesComponent } from '../components/resources/resources.component'
import { ResourceDetailsComponent } from '../components/resourcedetails/resourcedetails.component';

import { SurveyComponent } from '../components/survey/survey.component';
import { TopicsComponent } from '../components/topics/topics.component';

import { PaginatorComponent } from '../components/paginator/paginator.component';
import { DocumentComponent } from '../components/document/document.component';
import { SettingsComponent } from '../components/settings/settings.component';

import { SetpasswordComponent } from '../components/setpassword/setpassword.component';
import { ForgotpasswordComponent } from '../components/forgotpassword/forgotpassword.component';
import { SigndocComponent } from '../components/signdoc/signdoc.component';
import { CommentsComponent } from '../components/comments/comments.component';
import { MessengerComponent } from '../components/messenger/messenger.component';
import { MessageiconComponent } from '../components/messageicon/messageicon.component';
import { VotingdetailsComponent } from '../components/votingdetails/votingdetails.component';
import { VotingresultsComponent } from '../components/votingresults/votingresults.component';
import { RecordEditComponent } from '../components/recordedit/recordedit.component';
import { VotingsComponent } from '../components/votings/votings.component';
import { EsignDocsComponent } from "src/components/esigndocs/esigndocs.component";
import { EsignDocDetailsComponent } from "src/components/esigndocdetails/esigndocdetails.component";
import { RtcComponent } from '../components/rtc/rtc.component';
import { SurveysComponent } from '../components/surveys/surveys.component'


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        PageNotFound,
        HeaderComponent,
        ProfileDetailsComponent,
        ProfilesComponent,
        CommitteesComponent,
        CommitteeDetailsComponent,
        ResourcesComponent,
        ResourceDetailsComponent,
        MeetingsComponent,
        MeetingDetailsComponent,
        SurveyComponent,
        TopicsComponent,
        FormatTimePipe,
        CamelCasePipe,
        PaginatorComponent,
        DocumentComponent,
        SettingsComponent,
        KeysPipe,
        ChatComponent,
        SetpasswordComponent,
        ForgotpasswordComponent,
        SigndocComponent,
        CommentsComponent,
        MessengerComponent,
        MessageiconComponent,
        VotingdetailsComponent,
        VotingresultsComponent,
        RecordEditComponent,
        VotingsComponent,
        EsignDocsComponent,
        EsignDocDetailsComponent,
        RtcComponent,
        SurveysComponent,
    ],
    providers:[
        AuthGuard,
        SocketService,
        HttpService,
        Location, 
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent],
    entryComponents: [MessageiconComponent, MessengerComponent, ChatComponent, CommentsComponent,DocumentComponent ],    
})
export class AppModule { }
