var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');
const cls_model = require('./sdk/cls_model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5057431556:AAGnOFgp9MlogJhT3sjbMafwdIAdpPX2L8M'
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
        `input nilai suhu|ketinggianair contohnya 30|10`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1])
               
                
            ]
        ).then((jres1)=>{
            console.log(jres1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(jres1[0]), parseFloat(jres1[1])]).then((jres2)=>{
                bot.sendMessage(
                        msg.chat.id,
                        `nilai mistmaker yang diprediksi adalah ${jres1[0]}`
                );
                bot.sendMessage(
                        msg.chat.id,
                        `nilai ketinggianair yang diprediksi adalah ${jres1[1]}`
               
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
r.get('/predict/:N/:B', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.N), // string to float
            parseFloat(req.params.B)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

//routers
r.get('/classify/:N/:B', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.N), // string to float
            parseFloat(req.params.B)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.N), // string to float
                parseFloat(req.params.B),
                parseFloat(jres[0]),
                parseFloat(jres[1])
            ]
        ).then((jres_)=>{
            let status = "MIST MAKER OFF AIR SEDANG DIISI";
            
            if(dres_ == "1|1"){
                status = "MIST MAKER ON AIR SEDANG DIISI"
            }if(dres_ == "0|0"){
                status = "MIST MAKER OFF AIR OFF"
            }if(dres_ == "1|0"){
                status = "MIST MAKER ON AIR OFF"
            }
            
//             jres_.split("|");
            const suhu = parseFloat(req.params.N);
            const ketinggianair = parseFloat(req.params.B)
           
            bot.sendMessage(
                    2128268907, //msg.id
                    `SUHU:: ${suhu} KETINGGIAN AIR:: ${ketinggianair} KONDISI:: ${status}`
                     
                     
            ); // to telegram
            
            res.json({jres, jres_})
        })
    })
});

module.exports = r;
