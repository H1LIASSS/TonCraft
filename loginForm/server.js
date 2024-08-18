const express = require('express');
const cors = require('cors');
const app = express();
const {Rcon} = require('rcon-client');
const crypto = require('crypto');

const rconConfig = {
    host: '65.21.70.46',
    port: 25719,
    password: 'y3c3yfpMXn'
};

function generateVerifCode(){
    return (crypto.randomInt(100000, 1000000));
}

let verificationCodes = {}; 

app.use(cors());
app.use(express.json());

//generating verification code and sending it to the user
app.post('/', async (req,res)=>{
    try{
        const{ nickname }= req.body;
        
        if(!nickname){
            return res.status(400).json({error: 'Nickname is required'});
        }

        //REMOVE: 
        console.log(`nickname(serv): ${nickname}`);
        // TODO: make it so that it checks whether the player is online first
        const rcon = await Rcon.connect(rconConfig);
        const verifCode = generateVerifCode();  
        const response = await rcon.send(`msg ${nickname} Your verification code is: ${verifCode}`);
        await rcon.end();

        //checks whether or not the player is online
        if(!response){
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