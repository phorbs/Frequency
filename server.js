var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

//Módulo de configurações do servidor
const express = require('express');

//Configurações express
var app = express();

//Configuracoes gerais do express
app.set('view engine','ejs');
app.use(session({secret:'yuke'}));
app.use(bodyParser.urlencoded({extended:false}))

//Definindo middleware que atualiza o viewPermission
app.use(function(req, res, next){
    //console.log(req.session.user);
    if(req.session.user !== undefined){
        if(bcrypt.compareSync("D", req.session.user.permisao)){
            req.session.user.viewPermission = 'D';
        }else if(bcrypt.compareSync("A", req.session.user.permisao)){
            req.session.user.viewPermission = 'A';
        }else if(bcrypt.compareSync("EH", req.session.user.permisao)){
            req.session.user.viewPermission = 'EH';
        }else{
            req.session.user.viewPermission = 'N';
        }
    }
    next();
});

//Definindo as rotas 
require('./routes/auth.js')(app);
require('./routes/tests.js')(app);
require('./routes/inscricao.js')(app);
require('./routes/admin.js')(app);

module.exports = function(){
    app.listen(8009, function(){
        console.log("Frequency na porta: 8009 do localhost");
    });
}