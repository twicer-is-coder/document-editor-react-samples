const express = require('express')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const app = express()
const request = require("request");

const PORT = 5000
const OO_SECRET = "W15oPZkqLrwP7u7psFoTEuh7jIrk02oK"

var fs = require("fs");
var pathForSave = "test.docx";

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

let counter = 0;

function download (url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const sendReq = request.get(url);

        // verify response code
        sendReq.on('response', (response) => {
            if (response.statusCode !== 200) {
                reject('Response status was ' + response.statusCode);
            } else {
                sendReq.pipe(file);
            }
        });

        // close() is async, wait for it to complete
        file.on('finish', () => {
            file.close();
            resolve();
        });

        // check for request errors
        sendReq.on('error', (err) => {
            fs.unlink(dest, () => reject(err.message)); // delete the (partial) file and then reject the error
        });

        // handle errors during writing
        file.on('error', (err) => {
            fs.unlink(dest, () => reject(err.message)); // delete the (partial) file and then reject the error
        });
    });
};

// (async()=>{
//   try {
//     const test = "https://8080-twiceriscod-documentedi-slm1iyotihi.ws-us94.gitpod.io/cache/files/data/saad-temp-doc_8821/output.docx/output.docx?md5=p71o3T2vtzvIjKfgGmZuEQ&expires=1681770730&filename=output.docx";
//     await download(test, __dirname + "/public/alvin-doc.docx");
//     console.log("Done")
//   } catch (error) {
//     console.error("Error updating file", error)
//   }
// })()
// return;


app.post('/track', async (req, res) => {
    counter++;
    console.log(new Date());
    console.log(counter);
    console.log("poast track", req.body)
    console.log("payload", jwt.decode(req.body.token))
    switch (req.body.status) {
        case 1:
            console.log("Document is being edited.");
            const sample3 = {
                "actions": [{ "type": 1, "userid": "78e1e841" }],
                "key": "Khirz6zTPdfd7",
                "status": 1,
                "users": ["6d5a81d0", "78e1e841"]
            }
            break;
        case 2:
            console.log("Document is ready for saving.");
            console.log(req.body.history.changes)
            const sample1 = {
                "actions": [{ "type": 0, "userid": "78e1e841" }],
                "changesurl": "https://documentserver/url-to-changes.zip",
                "history": {
                    "changes": "changes",
                    "serverVersion": "serverVersion"
                },
                "filetype": "docx",
                "key": "Khirz6zTPdfd7",
                "status": 2,
                "url": "https://documentserver/url-to-edited-document.docx",
                "users": ["6d5a81d0"]
            };
            try {
                await download(req.body.url, __dirname + "/public/alvin-doc.docx");
                console.log("File Updated Successfully.")
            } catch (error) {
                console.error("Error updating file", error.message)
            }
            break;
        case 3:
            console.log("Document saving error has occurred.");
            break;
        case 4:
            console.log("Document is closed with no changes.");
            break;
        case 6:
            console.log("Document is being edited, but the current document state is saved.");
            console.log(req.body.history.changes)
            const sample2 = {
                "changesurl": "https://documentserver/url-to-changes.zip",
                "forcesavetype": 0,
                "history": {
                    "changes": "changes",
                    "serverVersion": "serverVersion"
                },
                "filetype": "docx",
                "key": "Khirz6zTPdfd7",
                "status": 6,
                "url": "https://documentserver/url-to-edited-document.docx",
                "users": ["6d5a81d0"],
                "userdata": "sample userdata"
            }
            try {
                await download(req.body.url, __dirname + "/public/alvin-doc.docx");
                console.log("File Updated Successfully.")
            } catch (error) {
                console.error("Error updating file", error.message)
            }
            break;
        case 7:
            console.log("Error has occurred while force saving the document.");
            break;
        default:
            console.log("Unknown document status.");
            break;
    }
    res.send({ "error": 0 })
})

app.post("/oo-config", function (req, res) {
    console.log("Sign route.")
    const config = {
        "document": {
            "key": "saad-temp-doc",
            "url": "https://5000-twiceriscod-documentedi-slm1iyotihi.ws-us94.gitpod.io/alvin-doc.docx"
        },
        "editorConfig": {
            "callbackUrl": "https://5000-twiceriscod-documentedi-slm1iyotihi.ws-us94.gitpod.io/track",
            "mode": "edit",
            "customization": {
                forcesave: true,
            },
            "user": {
                "group": "Test Group",
                "id": "0123456789",
                "name": "Saad Nadeem"
            },
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

