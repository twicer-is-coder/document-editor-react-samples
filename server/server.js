const express = require('express')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const app = express()

const PORT = 5000
const OO_SECRET = "CA8Jd8EaSTp9rBtLNaxW5Wv7zOBph2fg"

var fs = require("fs");
var pathForSave = "test.docx";

app.use(cors())
app.use(express.json())

app.post('/track', (req, res) => {
    console.log("post track", req.body)
    console.log("payload", jwt.decode(req.body.token))
    res.send({ "error": 0 })
})

app.post("/oo-config", function (req, res) {
    console.log("Sign route.")
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
    config.token = jwt.sign(config, OO_SECRET);
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

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
