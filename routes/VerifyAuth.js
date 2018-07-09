//express middleware para verificar o token caso seja valido devolver os dados do utilizador
function verifyToken(req, res, next) {

    if(req.session.user !== undefined && req.session.user.token !== undefined){
        next();
    }else{
        res.render('login',{authError:undefined});
    }
}

module.exports = verifyToken;