module.exports = function(app){
    
    var bcrypt = require('bcryptjs');
    var VerifyAuth = require('./VerifyAuth')

    app.get('/inscricao/sair/(:codigo)', VerifyAuth, function(req, res){
    
        var Request = require("request");

        Request.delete({
            headers: { "content-type": "application/x-www-form-urlencoded",
                        "x-access-token": req.session.user.token},
            user:{permisao:req.session.user.viewPermission},
            url: "http://localhost:8888/inscricao/delete/" + req.params.codigo,
            form: {
                //alunos_codigo: parseInt(req.session.user.codigo),
                //d: parseInt(req.params.codigo),
                }
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }

            var body = JSON.parse(body);
           // console.log(response.statusCode);
            //console.log(body.message);
            res.render('result', {user:req.session.user, permission:req.session.user.viewPermission, message:"Você não está mais inscrito no teste.", code:response.statusCode});
           //res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});
        });
        //res.render('test');
    });

    app.get('/inscricao/code/(:codigo)',VerifyAuth ,function(req, res){
        res.render('barcodeTest',{codigo:req.params.codigo, user:req.session.user, permission:req.session.user.viewPermission});
    });

    app.get('/inscricao/meus', VerifyAuth, function(req,res){

        var Request = require("request");

        Request.get({
            headers: { "content-type": "application/x-www-form-urlencoded",
                        "x-access-token": req.session.user.token},
            user:{permisao:req.session.user.viewPermission},
            url: "http://localhost:8888/inscricao/"+ req.session.user.codigo,
            form: {}
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }

            var body = JSON.parse(body);
            if(response.statusCode === 200){
                res.render('meusTests',{user:req.session.user, permission:req.session.user.viewPermission, inscricoes:body});
            }else{
                res.render('result', {user:req.session.user, permission:req.session.user.viewPermission, message:"Você não tem nenhum teste.", code:response.statusCode});
    
            }

        });
        //res.render('test');
    });

}