const express = require("express");
const { Telnet } = require('telnet-client');

var router = express.Router();

router.post('/auth-phone', async (req, res) => {
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
        await connection.write('config' + '\n' + `interface gpon 0/${dados.slot}` + '\n');
  
        const response = await connection.send(`ont confirm ${dados.pon} sn-auth ${dados.sn} omci ont-lineprofile-id 200 ont-srvprofile-id 200 desc "${dados.nome}"` + '\n\n');
        const res = response.split('\n');
        function getOnuId() {
          for (let i = 0; i < res.length; i++) {
            if (res[i].includes("ONTID")) {
              let string = res[i];
              let id = string.split(", ");
              let id2 = id[1].split(":");
              return id2[1]
  
            }
          }
        }
  
        const ontId = getOnuId();
        if (ontId === undefined) {
          await connection.end();
          const res = {
            error: true,
            message: "Erro, Não foi possível provisionar"
          }
          return res

        } else {
          console.log("Configurando ONU Telefone...");
          await connection.send(`ont ipconfig ${dados.pon} ${ontId} ip-index 0 dhcp vlan 2923 priority 2` + '\n');
          await connection.send(`ont ipconfig ${dados.pon} ${ontId} ip-index 3 dhcp vlan ${dados.vlanTel} priority 0` + '\n');  //Vlan Telefonia
          await connection.send('quit' + '\n');
          await connection.send(`service-port vlan 2923 gpon 0/${dados.slot}/${dados.pon} ont ${ontId} gemport 2 multi-service user-vlan 2923 tag-transform translate` + '\n\n');
          await connection.send(`service-port vlan ${dados.vlan} gpon 0/${dados.slot}/${dados.pon} ont ${ontId} gemport 1 multi-service user-vlan ${dados.vlan} tag-transform translate` + '\n\n');
          await connection.send(`service-port vlan ${dados.vlanTel} gpon 0/${dados.slot}/${dados.pon} ont ${ontId} gemport 1 multi-service user-vlan ${dados.vlanTel} tag-transform translate` + '\n\n');
          await connection.end();
          console.log("Finish!")
          const res = {
            error: false,
            message: "Onu provisionada com sucesso!!!"
          }
          return res
  
        }
  
      } catch (error) {
        res.status(500).json({ error: 'Erro na API' });
  
      }
  
    }
  
    const response = await connTelnet();
    return res.json(response)
  })

  module.exports = router;