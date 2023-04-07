const express = require('express')
const app = express()
const port = 5000
const jwt = require('jsonwebtoken');

const SECRET = "E5r0JOnqT08tPCeHCD5tibycukjpz68m"

var fs = require("fs");
var pathForSave = "test.docx";

app.use(express.json())

app.get('/track', (req, res) => {
    console.log("get track")
    res.send('Hello World!')
})

app.post('/track', (req, res) => {
    console.log("post track", req.body)
    console.log("payload", jwt.decode(req.body.token))
    res.send({ "error": 0 })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.post("/sign-oo-config", function (req, res) {

    const config = {
        "document": {
            "key": "Khirz6zTPdfd7",
            "url": "https://calibre-ebook.com/downloads/demos/demo.docx"
        },
        "editorConfig": {
            "callbackUrl": "https://twicer-is-coder-didactic-space-goldfish-wv69w9w9gp2gwqq-5000.preview.app.github.dev/track",
            "mode": "edit",
        },
        "documentType": "word",
        "height": "100%",
        "width": "100%",
    }

    config.token = jwt.sign(config, SECRET);

    console.log("send config", config)
    res.send(config);
});

app.post("/tarack", function (req, res) {

    var updateFile = function (response, body, path) {
        if (body.status == 2) {
            var file = syncRequest("GET", body.url);
            fs.writeFileSync(path, file.getBody());
        }

        response.write("{\"error\":0}");
        response.end();
    }

    var readbody = function (request, response, path) {
        var content = "";
        request.on("data", function (data) {
            content += data;
        });
        request.on("end", function () {
            var body = JSON.parse(content);
            updateFile(response, body, path);
        });
    }

    if (req.body.hasOwnProperty("status")) {
        updateFile(res, req.body, pathForSave);
    } else {
        readbody(req, res, pathForSave)
    }
});