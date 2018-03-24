'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = undefined;
const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const LAUNCH_MESSAGE = 'もう一度お願いします。';

const handlers = {
    'LaunchRequest': function () {
        this.response.speak(LAUNCH_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'GetFrameIntent': function () {
        // slot取得
        const character = this.event.request.intent.slots.Character.value;
        const technique = this.event.request.intent.slots.Technique.value;
        // message生成
        const message = `${character}の${technique}を聞き取りました。`;
        this.response.speak(message);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
