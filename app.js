// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// app.listen(3003, function(){
//     console.log('My express app is listening on port 3003!');   
// });

// app.get('/', (req,res) => {
//     console.log(req.query);
//     response = {
//         message: 'Hello there',
//         data: req.query, 
//     }
//     res.send(response.data);
// });

const builder = require('botbuilder');
const express = require('express');
const request = require('request');

// const connector = new builder.ConsoleConnector().listen();

// const bot = new builder.UniversalBot(connector,(session) => {
//         let userMessage = session.message.text;
//         session.send(`You said: ${userMessage}`);
//         session.send('You said: %s', userMessage);

// });

const app = express();
const connector = new builder.ChatConnector({
    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD,
    appId: "aa20023b-d83d-487f-885a-778cfd0cf5d9",
    appPassword: "CLoRMQuScumPyaisLet1er2",
});
//default is port 3978
app.listen(3978, () => {
    console.log('Chatbot server started and listening to port 3978');
});
app.post('/api/messages', connector.listen());

// const bot = new builder.UniversalBot(connector,(session) => {
//      session.send('You said: %s', session.message.text);

// });

const bot = new builder.UniversalBot(connector);

bot.dialog('/', (session) => {
    // if (session.message.text == 'hi'){
    //     session.beginDialog('greeting');
    // }
    
    switch(session.message.text){
        case 'hi':
        case 'hello':
            session.beginDialog('greeting');
            break;

        case '/trump':
            session.beginDialog('trump');
            break;
        case '/cat':
            session.beginDialog('cat');
            break;
        case '/nasa':
            session.beginDialog('nasa');
            break;
        default:
            session.endDialog('I did not understand that');
    }
});

bot.dialog('greeting', [
    (session) => {
        if (!session.userData.name){
            builder.Prompts.text(session, 'Hello, what is your name');
        }
        else {
            session.endDialog('Hello %s', session.userData.name)
        }
    //session.endDialog('Hello, I am Boternator');
    },
    (session, results) => {
        session.userData.name = results.response;
        session.endDialog('Hello, nice to meet you, %s', session.userData.name);
    }
]);

bot.dialog('trump', (session) => {
    session.sendTyping();
    request('https://api.whatdoestrumpthink.com/api/v1/quotes/random',
    (error, response, body) => {
        if(!error && response.statusCode == 200){
            body = JSON.parse(body);
            session.send('Mr. Trump Says');
            session.endDialog(body.message);
        }
        else {
            session.endDialog('Oops, something went wrong with Mr. Trump');
        }
    });
});

bot.dialog('cat', (session) => {
    session.sendTyping();
    request('http://random.cat/meow',
    (error, response, body) => {
        if(!error && response.statusCode == 200){
            body = JSON.parse(body);
            imageUrl = body.file
            imageType = imageUrl.slice(imageUrl.lastIndexOf('.') + 1, imageUrl.length);

            const msg = new builder.Message(session)
            .addAttachment({
                contentUrl: imageUrl,
                contentType: `image/${imageType}`,
                name: 'cat'
            });
            session.send(`Here's your car!`);
            session.endDialog(msg);
            
        }
        else {
            session.endDialog('Oops, something went wrong with Mr. Trump');
        }
    });
});

bot.dialog('nasa', (session) => {
    session.sendTyping();
    request('https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo',
    (error, response, body) => {
        if(!error && response.statusCode == 200){
            body = JSON.parse(body);
            session.send('NASA Says');
            session.endDialog(body.explanation);
        }
        else {
            session.endDialog('Oops, something went wrong with Mr. Trump');
        }
    });
});