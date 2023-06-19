const express = require("express");
const { Telnet } = require('telnet-client');

var router = express.Router();

router.post('/add-service', async (req, res) => {
    const dados = req.body;

    async function connTelnet() {

        const connection = new Telnet()

        const params = {
            host: process.env.HOST,
            port: 23,
            shellPrompt: '>', // or negotiationMandatory: false
            timeout: 1500,
            username: process.env.USER_NAME,
            password: process.env.PASS
        };

        try {

            await connection.connect(params);
            await connection.send(params.username + '\n' + params.password);
            await connection.send('enable' + '\n');
            await connection.write('config' + '\n');
            await connection.send(`service-port vlan ${dados.vlan} gpon 0/${dados.slot}/${dados.pon} ont ${dados.onu} gemport 1 multi-service user-vlan ${dados.vlan} tag-transform translate` + '\n\n');
            await connection.end();
            console.log("Finish!")
            const res = {
                error: false,
                message: "Serviço adicionado com sucesso!!!"
            }
            return res



        } catch (error) {
            res.status(500).json({ error: 'Erro na API' });

        }

    }

    const response = await connTelnet();
    return res.json(response)
})

module.exports = router;