import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { SimpleTopicSchema } from './topic.schema';
import { LabelSchema } from './label.schema';

export const MeetingSeriesSchema = new SimpleSchema({
    project: {type: String},
    name: {type: String},
    createdAt: {type: Date},
    visibleFor: {type: [String], regEx: SimpleSchema.RegEx.Id},
    informedUsers: {type: [String], optional: true}, // element may be userID or EMail address
    // todo: make this a date?
    lastMinutesDate: {type: String},
    minutes: {type: [String], defaultValue: []},
    openTopics: {type: [SimpleTopicSchema], defaultValue: []},
    topics: {type: [SimpleTopicSchema], defaultValue: []},
    availableLabels: {type: [LabelSchema], defaultValue: []},
    additionalResponsibles: {type: [String], defaultValue: []}
});
