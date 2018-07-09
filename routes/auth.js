module.exports = function(app){
    var bcrypt = require('bcryptjs');

    app.get('/logout', function(req,res){
        req.session.user = undefined;
        //console.log(req.session.user);
        res.render('login',{authError:"Você foi deslogado com sucesso"});
    });

    app.get('/login', function(req, res){
        if(req.session.user !== undefined && req.session.user.token !== undefined){
            res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});
        }else{
            res.render('login',{authError:undefined});
        }
    });

    app.get('/', function(req, res){
        if(req.session.user !== undefined && req.session.user.token !== undefined){
            res.render('main',{user:req.session.user, permission:req.session.user.viewPermission});
        }else{
            res.render('login',{authError:undefined});
        }
    });

    app.post('/login', function(req, res){
        
        var Request = require("request");

        Request.post({
            headers: { "content-type": "application/x-www-form-urlencoded" },
            url: "http://localhost:8888/user/login",
            form: {
                codigo: req.body.codigo,
                password: req.body.password}
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            //console.log(response.statusCode);
            //console.dir(JSON.parse(body));
            var body = JSON.parse(body);

            if(response.statusCode == 200){
                //Convertendo a permissao para n ser acessível facilmente
                var viewPermission = body.user.permisao;

                var hashedPermission = bcrypt.hashSync(body.user.permisao, 6);
                body.user.permisao = hashedPermission;
                body.user.token= body.token;

                //Setando a session para o user 
                req.session.user = body.user;
                res.render('main',{user:body.user, permission:viewPermission});
                //console.log(req.session.user);
            
            }else{
                res.render('login',{authError:"Nao foi possivel conectar."});

            }
        });
        //res.redirect('/main');
    });

}