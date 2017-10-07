import { E2EGlobal } from './helpers/E2EGlobal'
import { E2EApp } from './helpers/E2EApp'
import { E2EMeetingSeries } from './helpers/E2EMeetingSeries'
import { E2EMinutes } from './helpers/E2EMinutes'
import { E2ETopics } from './helpers/E2ETopics'

describe('MyActionItems Tab', function () {
    const aProjectName = "MyActionItems Tab";
    let aMeetingCounter = 0;
    let aMeetingNameBase = "Meeting Name #";

    before("reload page and reset app", function () {
        E2EApp.resetMyApp(true);
        E2EApp.launchApp();
    });

    beforeEach("goto start page and make sure test user is logged in", function () {
        E2EApp.gotoStartPage();
        expect(E2EApp.isLoggedIn()).to.be.true;
    });

    it("can filter my action items from all meeting series", function () {

        this.timeout(120000);

        let meetingName = aMeetingNameBase + '1';
        E2EMeetingSeries.createMeetingSeries(aProjectName, meetingName);

        E2EMinutes.addMinutesToMeetingSeries(aProjectName, meetingName);
        E2ETopics.addTopicToMinutes('topic #1');
        E2ETopics.addInfoItemToTopic({subject: 'action item  #1', itemType: "actionItem", responsible: E2EApp.getCurrentUser()}, 1);
        E2EMinutes.finalizeCurrentMinutes();

        E2EMinutes.addMinutesToMeetingSeries(aProjectName, meetingName);
        E2ETopics.addTopicToMinutes('topic #2');
        E2ETopics.addInfoItemToTopic({subject: 'action item  #2', itemType: "actionItem", responsible: E2EApp.getCurrentUser()}, 1);
        E2ETopics.toggleActionItem(1, 1);
        E2EMinutes.finalizeCurrentMinutes();

        meetingName = aMeetingNameBase + '2';
        E2EMeetingSeries.createMeetingSeries(aProjectName, meetingName);

        E2EMinutes.addMinutesToMeetingSeries(aProjectName, meetingName);
        E2ETopics.addTopicToMinutes('topic #3');
        E2ETopics.addInfoItemToTopic({subject: 'action item  #3', itemType: "actionItem", responsible: E2EApp.getCurrentUser()}, 1);
        E2EMinutes.finalizeCurrentMinutes();

        E2EMinutes.addMinutesToMeetingSeries(aProjectName, meetingName);
        E2ETopics.addTopicToMinutes('topic #4');
        E2ETopics.addInfoItemToTopic({subject: 'action item  #4', itemType: "actionItem", responsible: E2EApp.getCurrentUser()}, 1);
        E2EMinutes.finalizeCurrentMinutes();

        E2EApp.gotoStartPage();
        E2EApp.gotoActionItemsTab();

        expect(E2ETopics.countItemsForTopic('#itemPanel'), "Items list should have four items").to.equal(4);
    });

    it("can filter my action items from all action items", function () {
        let meetingName = aMeetingNameBase + '1';
        E2EMeetingSeries.createMeetingSeries(aProjectName, meetingName);

        E2EMinutes.addMinutesToMeetingSeries(aProjectName, meetingName);
        E2ETopics.addTopicToMinutes('topic #1');
        E2ETopics.addInfoItemToTopic({subject: 'action item  #2', itemType: "actionItem", responsible: E2EApp.getCurrentUser()}, 1);
        E2ETopics.addInfoItemToTopic({subject: 'action item  #1', itemType: "actionItem", responsible: (E2EApp.getCurrentUser() + ',' + E2EGlobal.SETTINGS.e2eTestUsers[1])}, 1);
        E2ETopics.addInfoItemToTopic({subject: 'action item  #2', itemType: "actionItem", responsible: E2EGlobal.SETTINGS.e2eTestUsers[2]}, 1);
        E2EMinutes.finalizeCurrentMinutes();

        E2EApp.gotoStartPage();
        E2EApp.gotoActionItemsTab();

        expect(E2ETopics.countItemsForTopic('#itemPanel'), "Items list should have two items").to.equal(2);
    });
});