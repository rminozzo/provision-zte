const express = require("express");
var router = express.Router();

router.get('/onus', async (req, res) => {
    try {
      const response = await fetch('https://adyinet.smartolt.com/api/onu/unconfigured_onus_for_olt/115', {
        'headers': {
          'X-Token': '16fef575062f433d98d1a5c6de07edd8'
        },
      });
      const jsonData = await response.json();
      res.json(jsonData);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter os dados' });
    }
  });

module.exports = router;

