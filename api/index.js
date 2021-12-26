var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');
const cls_model = require('./sdk/cls_model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5056542354:AAEbTD6oz_OJnifzayQFMgyuJ7EF6qVrzUs' 
const bot = new TelegramBot(token, {polling: true});

state = 0;
// bots
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        Selamat datang di TA islahuddin
        click /predict`
    );   
    state = 0;
});

//input S dan K
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `input nilai suhu|kelembaban|ketinggianair contohnya 30|60|10`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1]),
                parseFloat(s[2])
               
                
            ]
        ).then((jres1)=>{
            console.log(jres1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(s[2]), parseFloat(jres1[0]), parseFloat(jres1[1]), parseFloat(jres1[2])]).then((jres2)=>{
                bot.sendMessage(
                        msg.chat.id,
                        `nilai pompa yang diprediksi adalah ${jres1[0]}`
                );
                bot.sendMessage(
                        msg.chat.id,
                        `nilai kipas yang diprediksi adalah ${jres1[1]}`
                );
                bot.sendMessage(
                        msg.chat.id,
                        `nilai ketinggianair yang diprediksi adalah ${jres1[2]}`
               
                ); 
                bot.sendMessage(
                        msg.chat.id,
                        `Klasifikasi ${jres2}`
                );
                state = 0;
            })
        })
    }else{
        bot.sendMessage(
        msg.chat.id,
              `Please Click /start `
        );
        state = 0
    }
})
// routers
r.get('/predict/:S/:K/:A', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.S), // string to float
            parseFloat(req.params.K),
            parseFloat(req.params.A)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

//routers
r.get('/classify/:S/:K/:A', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.S), // string to float
            parseFloat(req.params.K),
            parseFloat(req.params.A)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.S), // string to float
                parseFloat(req.params.K),
                parseFloat(req.params.A),
                parseFloat(jres[0]),
                parseFloat(jres[1]),
                parseFloat(jres[2])
            ]
        ).then((jres_)=>{
            let status = "";
            
            const [pompa, kipas, kran] = jres_.split("|")
            
            if (pompa === "1") {
                status += "POMPA ON";
            } else {
                status += "POMPA OFF";
            }
            
            if (kipas === "1") {
                status += "KIPAS ON";
            } else {
                status += "KIPAS OFF";
            }
            
             if (kran === "1") {
                status += "KRAN ON";
            } else {
                status += "KRAN OFF";
            }
            
            
//             if(jres_ == "0|1|1"){
//                 status = "POMPA OFF KIPAS OFF KRAN ON"
//             }if(jres_ == "0|0|0"){
//                 status = "POMPA OFF KIPAS OFF KRAN OFF"
//             }if(jres_ == "0|1|0"){
//                 status = "POMPA OFF KIPAS ON KRAN OFF"
//             }if(jres_ == "1|0|0"){
//                 status = "POMPA OFF KIPAS OFF KRAN ON"
//             }if(jres_ == "1|1|0"){
//                 status = "POMPA ON KIPAS ON KRAN OFF"
//             }
            
//             jres_.split("|");
            const suhu = parseFloat(req.params.S);
            const kelembaban = parseFloat(req.params.K);
            const ketinggianair = parseFloat(req.params.A)
            
            
           
            bot.sendMessage(
                    2128268907, //msg.id
                    `SUHU:: ${suhu} KELEMBABAN:: ${kelembaban} KETINGGIAN AIR:: ${ketinggianair} KONDISI:: ${status}`
                     
                     
            ); // to telegram
            
            res.json({jres, jres_})
        })
    })
});

module.exports = r;
