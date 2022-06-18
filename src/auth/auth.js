const auth = async (req, res, next)=>{
    console.log({authorisation: "this is from auth to make sure it's working"});
    req.user = {_id: 1513205486516, nickname: 'user101'};
    //query db for user ( and auth0 api)
    next()
}
// to be modified 
const isItAuth = (req, res, next) =>{
    req.isAuth = 'indeed it is';
    next();
}
module.exports = {auth, isItAuth};