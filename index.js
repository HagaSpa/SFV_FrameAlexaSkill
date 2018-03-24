'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
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
        const character = this.event.request.intent.slots.Character.value; // キャラ名
        const technique = this.event.request.intent.slots.Technique.value; // 技名

        console.log('character：', character);
        console.log('technique：', technique);

        // 発生フレームを取得する
        getStartUp(character, technique).then(startUp => {
            if (startUp === '') {
                const message = 'その技は存在しません。';
                this.response.speak(message);
                this.emit(':responseReady');
            }

            // message生成
            const message = `${character}の${technique}は${startUp}フレームです。`;
            this.response.speak(message);
            this.emit(':responseReady');
        }).catch(err => {
            console.error(err);
            const message = '申し訳ございません。エラーが発生しました。';
            this.response.speak(message);
            this.emit(':responseReady');
        });
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

/**
 * DynamoDBからStartUpを取得する。
 * 
 * @param {String} character キャラ名
 * @param {String} technique 技名
 */
const getStartUp = ((character, technique) => {
    return new Promise((resolve, reject) => {
        // DynamoDB接続準備
        const docClient = new AWS.DynamoDB.DocumentClient();
        const tableName = 'SFV_FrameData';
        const params = {
            TableName: tableName,
            Key:{
                "character_name": character,
                "technique_name": technique
            }
        };

        docClient.get(params, function(err, data) {
            if (err) {
                // エラー時
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            }

            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));

            let startUp = '';

            // 取得結果が空の場合を考慮
            if (data.hasOwnProperty('Item')) {
                startUp = data.Item.start_up;
            }

            resolve(startUp);
        });
    });
});