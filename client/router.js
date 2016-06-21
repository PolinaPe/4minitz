import { Meteor } from 'meteor/meteor';

import { MeetingSeries } from '/imports/meetingseries'
import { Minutes } from '/imports/minutes'
import { UserRoles } from '/imports/userroles'

Router.configure({
    // set default application template for all routes
    layoutTemplate: 'appLayout'
});

Router.onBeforeAction(function () {
    if (!Meteor.userId()) {
        // if the user is not logged in, render the Login template
        this.render('login');
    } else {
        // otherwise don't hold up the rest of hooks or our route/action function
        // from running
        this.next();
    }
});

Router.route('/', {name: 'home'});

Router.route('/meetingseries/:_id', function () {
    var meetingSeriesID = this.params._id;

    // we have to wait until the client side db is ready
    // otherwise creating the UserRoles-Object will fail
    this.subscribe('userListSimple', Meteor.userId()).wait();

    if (this.ready()) {
        let usrRoles = new UserRoles();
        if (usrRoles.hasViewRoleFor(meetingSeriesID)) {
            this.render('meetingSeriesDetails', {data: meetingSeriesID});
        } else {
            Router.go("/");
        }
    } else {
        this.render('loading');
    }
});

Router.route('/minutesadd/:_id', function () {
    let meetingSeriesID = this.params._id;

    let usrRoles = new UserRoles();
    if (!usrRoles.hasViewRoleFor(meetingSeriesID)) {
        Router.go("/");
    }

    let id;
    ms = new MeetingSeries(meetingSeriesID);
    ms.addNewMinutes(
        // optimistic ui callback
        newMinutesID => {
            id = newMinutesID
        },

        // server callback
        (error/*, newMinutesID*/) => {
            // no need to redirect to correct minutes page
            // as the optimistic ui callback already took
            // care of that

            if (error) {
                // display error
                Session.set("errorTitle", error.error);
                Session.set("errorReason", error.reason);
                this.redirect('/meetingseries/' + meetingSeriesID);
            }
        }
    );

    // callback should have been called by now
    if (id) {
        this.redirect('/minutesedit/' + id);
    } else {
        // todo: use error page
        this.redirect('/meetingseries/' + meetingSeriesID);
    }
});


Router.route('/minutesedit/:_id', function () {
    var minutesID = this.params._id;

    this.subscribe('minutes', minutesID).wait();

    if (this.ready()) {
        let usrRoles = new UserRoles();
        let aMin = new Minutes(minutesID);
        if (usrRoles.hasViewRoleFor(aMin.meetingSeries_id)) {
            this.render('minutesedit', {data: minutesID});
        } else {
            Router.go("/");
        }
    } else {
        this.render('loading');
    }
});
