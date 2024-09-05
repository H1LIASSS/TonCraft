const express = require('express');
const cors = require('cors');
const app = express();
const {Rcon} = require('rcon-client');
const crypto = require('crypto');
const mysql = require('mysql2');
app.use(cors());
app.use(express.json());

const rconConfig = {
    host: '65.21.70.46',
    port: 25719,
    password: 'y3c3yfpMXn'
};
// TODO: env variables
// db setup
const cmiDB = mysql.createConnection({
    host: 'mysql-pl-wa2.joinserver.xyz',
    user: 'u136036_cgI1eC8GWq',
    password: '@cfGHNrnsTN9heQsqhL!=X.y',
    database: 's136036_CMI'
});

cmiDB.connect(err=>{
    if(err){
        console.log(`Couldn't connect to cmiDB`);
        return;
    }
    console.log('connected to cmiDB');
})

app.get('/userData', (req,res)=>{
    nickname = req.query.nickname;
    console.log(nickname);

    cmiDB.query('SELECT * FROM `CMI_users` WHERE `username` = ?', [nickname], (err, results)=>{
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json(results);
    });

})
app.get('/getOnline', async (req,res)=>{
    const rcon = await Rcon.connect(rconConfig);
    const response = await rcon.send('list');
    let online = response.match(/There are §c(\d+)§6/);
    if(online[1]){
        let onlineCount = online[1];
        res.json(onlineCount);
    }
    else res.json(0);
})
//generating verification code and sending it to the user
function generateVerifCode(){
    return (crypto.randomInt(100000, 1000000));
}

let verificationCodes = {}; 

app.post('/', async (req,res)=>{
    try{
        const{ nickname }= req.body;
        
        if(!nickname){
            return res.status(400).json({error: 'Nickname is required'});
        }

        //REMOVE: 
        console.log(`nickname(serv): ${nickname}`);
        const rcon = await Rcon.connect(rconConfig);
        const verifCode = generateVerifCode();  
        // const response = await rcon.send(`msg ${nickname} Your verification code is: ${verifCode}`);
        const response = await rcon.send(`msg ${nickname} Your verification code is: ${verifCode}`);
        await rcon.end();

        //checks whether or not the player was online
        if(response === ''){
            //stores the verification code for 2 minutes
            verificationCodes[nickname] = verifCode;
            setTimeout(()=>{
                delete verificationCodes[nickname];
            }, 120000)
            res.json({ success: true, message: `successful` });
        }
        else{
            res.json({ success: false, message: `player not found` });
        }
    }catch(err){
        console.log('ERROR');
        res.status(500).json({error: 'Internal Server Error'});
    }

})

//checking verification code matching
app.post('/verifyCode', (req,res)=>{
    try{
        if(req.body.verificationCode == verificationCodes[req.body.nickname]) res.json({success: true, message: "correct verification code"})
        else res.json({success: false, message: "incorrect verification code"});
    }catch{
        console.log(`err processing verif code`);
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);          
});