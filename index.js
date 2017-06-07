var express = require("express");
var app = express();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('c9', 'unknownazazel', '', {
    host: process.env.IP,
    dialect: 'mysql'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })


const model = sequelize.define('url', {
    originalUrl: Sequelize.STRING,
}, {
    timestamps: false
});

/* //test val
model.sync().then(() => {
  return model.create({
    originalUrl: 'test'
  })
})
*/
app.get('/:id(\\d+)/', function(req, res) {
    console.log('redirect Mode : ' + req.params.id.replace(/\"/g, ""));
    model.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(d) {
        console.log(d.originalUrl.replace(/\"/g, ""));
        res.redirect(302, d.originalUrl.replace(/\"/g, ""));
        return;
    });
});


app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});


app.get('/*', function(req, res) {
    //remove trailing slash
    var url = urldecode(JSON.stringify(req.originalUrl)).replace(/\//, "");

    console.log(url + "L:33");
    if (url.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)) {
        console.log("urlMode");
        url.replace(/\"/g, "");

        model.findOrCreate({
            where: {
                originalUrl: url
            }
        }).spread((item, created) => {

            if (!created) {

                res.send("<body> http://" + req.headers.host + "/" + item.id + "</body>");
                return;
            }
            else {
                res.send("<body>New Entry! Use:</br> http://" + req.headers.host + "/" + item.id + "</body>");
                return;


            }
        });


    }

    else {
        res.send("<body> Error handling yer req</body>")


    }

});

app.listen(process.env.PORT, function() {
    console.log('Example app listening on port' + process.env.PORT);

});


function urldecode(str) {
    return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}
