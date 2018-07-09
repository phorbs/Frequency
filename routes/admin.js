module.exports = function(app){
    var bcrypt = require('bcryptjs');
    
    function VerifyAdmin(req, res, next){
        if( req.session.user !== undefined && "EH" === req.session.user.viewPermission && undefined !== req.session.user.token){
            next();
        }else{
            res.render('login',{authError:"Não tem autorização para acessar esse recurso"});
        }
    }

    app.get('/admin/users/add', VerifyAdmin ,function(req,res){
        res.render('registerUser',{user:req.session.user, permission:req.session.user.viewPermission});
    });

    app.post('/admin/users/add', VerifyAdmin,function(req, res){

        //Verifica se os campos estão preenchidos
        var Request = require("request");

        Request.post({
            headers: { "content-type": "application/x-www-form-urlencoded" ,
            "x-access-token": req.session.user.token},
            url: "http://localhost:8888/api/auth/register",
            form: {
                codigo: req.body.codigo,
                email: req.body.email,
                password: req.body.password}
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }

            var body = JSON.parse(body);
        });
        if(req.body.tipoUsuario === "A"){

            Request.post({
                headers: { "content-type": "application/x-www-form-urlencoded" ,
                "x-access-token": req.session.user.token},
                url: "http://localhost:8888/aluno/add",
                form: {
                    codigo: req.body.codigo,
                    nome: req.body.nome,
                    curso: req.body.curso}
            }, (error, response, body) => {
                if(error) {
                    return console.dir(error);
                }
    
                var body = JSON.parse(body);
            });

        }else if(req.body.tipoUsuario === "D"){
            //Cadastra Docente
            Request.post({
                headers: { "content-type": "application/x-www-form-urlencoded" ,
                "x-access-token": req.session.user.token},
                url: "http://localhost:8888/docente/add",
                form: {
                    codigo: req.body.codigo,
                    nome: req.body.nome}
            }, (error, response, body) => {
                if(error) {
                    return console.dir(error);
                }
                console.log(body);
                var body = JSON.parse(body);
                //res.render('result', {user:req.session.user, permission:req.session.user.viewPermission, message:body.message, code:response.statusCode});

            });
        }
        res.render('result', {user:req.session.user, permission:req.session.user.viewPermission, message:"Cadastro efetuado", code:200});
        //res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});
    });

    app.get('/admin/ucs', VerifyAdmin ,function(req,res){
        var Request = require('request');

        Request.get({
            headers: { "content-type": "application/x-www-form-urlencoded",
                        "x-access-token": req.session.user.token},
            user:{permisao:req.session.user.viewPermission},
            url: "http://localhost:8888/uc/",
            form: {}
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }

            if(response.statusCode === 200){
                res.render('adminUCs',{user:req.session.user, permission:req.session.user.viewPermission, ucs:JSON.parse(body)}); 
                return;   
            }
        });
        
       // res.render('register');
    });

    app.get('/admin/ucs/add', VerifyAdmin ,function(req,res){    
        res.render('registerUC', {user:req.session.user, permission:req.session.user.viewPermission, uc:undefined});
    });

    app.post('/admin/ucs/add', VerifyAdmin,function(req, res){

        var Request = require("request");

        Request.post({
            headers: { "content-type": "application/x-www-form-urlencoded",
            "x-access-token": req.session.user.token},
            url: "http://localhost:8888/uc/add",
            form: {
                designacao: req.body.unidadeCurricular}
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
           // console.log(response.statusCode);
            //console.dir(JSON.parse(body));
            var body = JSON.parse(body);
            res.render('result', {user:req.session.user, permission:req.session.user.viewPermission, message:body.message, code:response.statusCode});

        });
        //res.redirect('/admin/ucs');
    });

    app.get('/admin/ucs/edit/(:codigo)', VerifyAdmin ,function(req,res){
        var Request = require('request');

        Request.get({
            headers: { "content-type": "application/x-www-form-urlencoded",
                        "x-access-token": req.session.user.token},
            user:{permisao:req.session.user.viewPermission},
            url: "http://localhost:8888/uc/edit/" + req.params.codigo,
            form: {}
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            if(response.statusCode === 200){
                res.render('registerUC',{user:req.session.user, permission:req.session.user.viewPermission, uc:JSON.parse(body)}); 
                return;   
            }
            res.render('result', {user:req.session.user, permission:req.session.user.viewPermission, message:body.message, code:response.statusCode});
        });
       // res.render('register');
    });

    app.post('/admin/ucs/edit/(:codigo)', VerifyAdmin,function(req, res){

        console.log(req.session.user.viewPermission)
        //Verifica se os campos estão preenchidos
        var Request = require("request");

        Request.put({
            headers: { "content-type": "application/x-www-form-urlencoded",
            "x-access-token": req.session.user.token},
            url: "http://localhost:8888/uc/edit/" + req.params.codigo,
            form: {
                designacao: req.body.unidadeCurricular}
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
           // console.log(response.statusCode);
            //console.dir(JSON.parse(body));
            var body = JSON.parse(body);
            res.render('result', {user:req.session.user, permission:req.session.user.viewPermission, message:body.message, code:response.statusCode});
        });
        //res.redirect('/admin/ucs');
    });

    app.get('/admin/ucs/remover/(:codigo)', VerifyAdmin, function(req, res){
    
        var Request = require("request");

        Request.delete({
            headers: { "content-type": "application/x-www-form-urlencoded",
                        "x-access-token": req.session.user.token},
            user:{permisao:req.session.user.viewPermission},
            url: "http://localhost:8888/uc/delete/" + req.params.codigo,
            form: {
                }
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }

            var body = JSON.parse(body);
            res.render('result', {user:req.session.user, permission:req.session.user.viewPermission, message:body.message, code:response.statusCode});
           // res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});
        });
        //res.render('test');
    });

}