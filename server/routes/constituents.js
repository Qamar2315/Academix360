const express= require('express');
const router= express.Router();
const {addConstituent,getConstituents,checkDuplicates,generateCsv} = require('../controllers/constituents');
const {validateConstituent} = require('../middlewares/schemaValidator')

router.route('/')
    .get(getConstituents)
    .post(validateConstituent,addConstituent)

router.route('/check_duplicates')
    .get(checkDuplicates)

router.route('/export')
    .get(generateCsv)

module.exports=router