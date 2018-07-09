module.exports = function (app) {
    var bcrypt = require('bcryptjs');
    var VerifyAuth = require('./VerifyAuth');

    app.get('/tests/historico', VerifyAuth, function (req, res) {
        res.render('historico');
    });

    app.get('/tests/meus', VerifyAuth, function (req, res) {

        var Request = require("request");

        Request.get({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: { permisao: req.session.user.viewPermission },
            url: "http://localhost:8888/prova/doc/" + req.session.user.codigo,
            form: {}
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            var body = JSON.parse(body);
            res.render('meusTests', { user: req.session.user, permission: req.session.user.viewPermission, inscricoes: body });
        });
        //res.render('test');
    });

    app.get('/tests/add', VerifyAuth, function (req, res) {
        var Request = require("request");

        Request.get({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: { permisao: req.session.user.viewPermission },
            url: "http://localhost:8888/uc/",
            form: {}
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            //console.log(response);
            if (response.statusCode === 200) {
                res.render('newTest', { user: req.session.user, permission: req.session.user.viewPermission, ucs: JSON.parse(body) });
                return;
            }
        });

        // res.render('error');
    });

    app.post('/tests/add', VerifyAuth, function (req, res) {
        var Request = require("request");
        var moment = require('moment');

        //console.log(req.body);
        //console.log(moment(req.body.data).format('YYYY/MM/DD h:mm:ss'));
        Request.post({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: { permisao: req.session.user.viewPermission },
            url: "http://localhost:8888/prova/add",
            form: {
                tipo: req.body.tipo,
                data: moment(req.body.data).format('YYYY/MM/DD h:mm:ss'),
                sala: req.body.sala,
                lotacao: parseInt(req.body.lotacaoMaxima),
                codigo: parseInt(req.session.user.codigo),
                iduc: parseInt(req.body.id_uc)
            }
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }

            var body = JSON.parse(body);
            //console.log(body.rows);
            res.render('result', { user: req.session.user, permission: req.session.user.viewPermission, message: body.message, code: response.statusCode });

            //res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});

        });
    });

    app.get('/tests/editar/(:codigo)', VerifyAuth, function (req, res) {

        var Request = require("request");
        var moment = require('moment');
        var ucs;

        //Faz get das ucs
        Request.get({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: { permisao: req.session.user.viewPermission },
            url: "http://localhost:8888/uc/",
            form: {}
        }, (error, response, bod) => {
            if (error) {
                return console.dir(error);
            }

            if (response.statusCode === 200) {
                ucs = JSON.parse(bod);
            }
        });


        Request.get({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: { permisao: req.session.user.viewPermission },
            url: "http://localhost:8888/prova/edit/" + req.params.codigo,
            form: {}
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            //console.log(response.statusCode);
            body = JSON.parse(body);

            //console.log(response.statusCode);
            body[0].data = moment(new Date(body[0].data)).format('DD/MM/YYYY HH:mm'),

                res.render('editTest', { user: req.session.user, permission: req.session.user.viewPermission, teste: body, ucs: ucs });
        });
        //res.render('test');

    });

    app.post('/tests/edit/', VerifyAuth, function (req, res) {
        var Request = require("request");
        var moment = require('moment');

        var parseMoment = moment(req.body.data, "YYYY/MM/DD HH:mm");
        parseData = moment(new Date(parseMoment)).format("YYYY/MM/DD HH:mm");
        
        Request.put({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: { permisao: req.session.user.viewPermission },
            url: "http://localhost:8888/prova/edit/" + req.body.id,
            form: {
                tipo: req.body.tipo,
                data: parseData,
                sala: req.body.sala,
                codigo:req.session.user.codigo,
                estado:1,
                lotacao: parseInt(req.body.lotacaoMaxima),
                iduc: parseInt(req.body.id_uc)
            }
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            var body = JSON.parse(body);
            //console.log(body.rows);
            res.render('result', { user: req.session.user, permission: req.session.user.viewPermission, message: body.message, code: response.statusCode });

            //res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});

        });
    });

    app.get('/tests/andamento', VerifyAuth, function (req, res) {

        //console.log(req.session.user.token);    
        var Request = require("request");
        Request.get({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: { permisao: req.session.user.viewPermission },
            url: "http://localhost:8888/prova/",
            form: {}
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }

            if (response.statusCode === 200) {
                var body = JSON.parse(body);
                //console.log(body[0]);
                res.render('andamento', { user: req.session.user, permission: req.session.user.viewPermission, tests: body });
                return;
            }
            res.render('error');
        });
    });

    app.get('/tests/frequencias/(:codigo)', VerifyAuth, function (req, res) {
        var Request = require("request");
        Request.get({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: { permisao: req.session.user.viewPermission },
            url: "http://localhost:8888/inscricao/frequencias/" + req.params.codigo,
            form: {}
        }, (error, response, body) => {
            // console.log(body);
            if (error) {
                return console.dir(error);
            }

            if (response.statusCode === 200) {
                var body = JSON.parse(body);
                console.log(body);
                res.render('frequencias', { user: req.session.user, permission: req.session.user.viewPermission, frequencias: body });
                return;
            } else if (response.statusCode === 404) {
                res.render('result', { user: req.session.user, permission: req.session.user.viewPermission, message: "Não há nenhuma frequência cadastrada.", code: response.statusCode });
                return;
            }
            res.render('result', { user: req.session.user, permission: req.session.user.viewPermission, message: body.message, code: response.statusCode });
        });
    });

    app.get('/tests/inscrever/(:codigo)', VerifyAuth, function (req, res) {

        var Request = require("request");

        Request.post({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: { permisao: req.session.user.viewPermission },
            url: "http://localhost:8888/inscricao/add",
            form: {
                alunos_codigo: parseInt(req.session.user.codigo),
                provas_idprova: parseInt(req.params.codigo),
            }
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }

            var body = JSON.parse(body);
            res.render('result', { user: req.session.user, permission: req.session.user.viewPermission, message: "Você está inscrito no teste.", code: response.statusCode });
            //res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});
        });
        //res.render('test');
    });

    app.get('/tests/cancelar/(:codigo)', VerifyAuth, function (req, res) {

        var Request = require("request");

        Request.delete({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: {
                permisao: req.session.user.viewPermission,
                codigo: req.session.user.codigo
            },
            url: "http://localhost:8888/prova/delete/" + req.params.codigo,
            form: {
                //alunos_codigo: parseInt(req.session.user.codigo),
                //d: parseInt(req.params.codigo),
            }
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }

            var body = JSON.parse(body);
            //console.log(response.statusCode);
            //console.log(body.message);

            res.render('result', { user: req.session.user, permission: req.session.user.viewPermission, message: body.message, code: response.statusCode });
            //res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});
        });
        //res.render('test');
    });

    app.get('/tests/desativar/(:codigo)', VerifyAuth, function (req, res) {

        var Request = require("request");

        Request.put({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: {
                permisao: req.session.user.viewPermission,
                codigo: req.session.user.codigo
            },
            url: "http://localhost:8888/prova/desativa/" + req.params.codigo,
            form: {}
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }

            var body = JSON.parse(body);
            //console.log(response.statusCode);
            //console.log(body.message);      
            res.render('result', { user: req.session.user, permission: req.session.user.viewPermission, message: body.message, code: body.code });
            //res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});
        });
        //res.render('test');
    });

    app.get('/tests/ativar/(:codigo)', VerifyAuth, function (req, res) {

        var Request = require("request");

        Request.put({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-access-token": req.session.user.token
            },
            user: {
                permisao: req.session.user.viewPermission,
                codigo: req.session.user.codigo
            },
            url: "http://localhost:8888/prova/ativar/" + req.params.codigo,
            form: {}
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }

            var body = JSON.parse(body);
            res.render('result', { user: req.session.user, permission: req.session.user.viewPermission, message: body.message, code: body.code });
        });
        //res.render('test');
    });
}