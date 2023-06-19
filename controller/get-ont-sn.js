const express = require("express");
var router = express.Router();
require('dotenv').config();


router.get('/search-onu/:pesq', async (req, res) => {
    const data = req.params.pesq
    await sleep(3000);

    function sleep(ms){
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    };
    
    try {
      const response = await fetch(`https://adyinet.smartolt.com/api/onu/get_onus_details_by_sn/${data}`, {
        'headers': {
          'X-Token': process.env.API_KEY
        },
      });
      const jsonData = await response.json();
      res.json(jsonData);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter os dados' });
    }
  });

module.exports = router;
