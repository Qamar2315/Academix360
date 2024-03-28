const {constituentSchema}= require('../schemas/constituentSchema')

const AppError= require('../utilities/AppError')

module.exports.validateConstituent= (req,res,next)=>{
    const {error}= constituentSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el=> el.message).join(',');
        throw new AppError(msg,400);
    }else{
        next()
    }
}