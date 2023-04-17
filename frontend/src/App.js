import React, { useEffect, useState } from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";

import './App.css';
import axios from 'axios';

//DOCUMENT SERVER ON CODESPACES
const CODESPACES_OO = "https://8080-twiceriscod-documentedi-slm1iyotihi.ws-us94.gitpod.io"

//DOCUMENT SERVER ON VULTR
const VULTR_URL = "https://onlyoffice.twicegaming.com/"

//BACKEND NODE.JS SERVER ON CODESPACES
const CODESPACES_SERVER = "https://5000-twiceriscod-documentedi-slm1iyotihi.ws-us94.gitpod.io"

const oldconfig = {
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2N1bWVudCI6eyJrZXkiOiJLaGlyejZ6VFBkZmQ4IiwidXJsIjoiaHR0cHM6Ly9jYWxpYnJlLWVib29rLmNvbS9kb3dubG9hZHMvZGVtb3MvZGVtby5kb2N4In0sImVkaXRvckNvbmZpZyI6eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vdHdpY2VyLWlzLWNvZGVyLWRpZGFjdGljLXNwYWNlLWdvbGRmaXNoLXd2Njl3OXc5Z3AyZ3dxcS01MDAwLnByZXZpZXcuYXBwLmdpdGh1Yi5kZXYvdHJhY2siLCJtb2RlIjoiZWRpdCJ9LCJkb2N1bWVudFR5cGUiOiJ3b3JkIiwiaGVpZ2h0IjoiMTAwJSIsIndpZHRoIjoiMTAwJSJ9.kXFCp3Tfh7eLcI4kK5Ak8WrlXGm77wZV9I1E4oLPapY"
}

function App() {

  const [gettingToken, setGettingToken] = useState(true);
  const [ooConfig, setOOConfig] = useState(null);

  const onDocumentReady = function (event) {
    console.log("Document is loaded", event);
  };

  const onLoadComponentError = function (errorCode, errorDescription) {
    switch (errorCode) {
      case -1: // Unknown error loading component
        console.log(errorDescription);
        break;

      case -2: // Error load DocsAPI from http://documentserver/
        console.log(errorDescription);
        break;

      case -3: // DocsAPI is not defined
        console.log(errorDescription);
        break;
      default:
        console.log(errorDescription);
    }
  };

  const getOOConfig = async () => {
    try {
      const response = await axios.post(`${CODESPACES_SERVER}/oo-config`);
      console.log("response", response);
      setGettingToken(false);
      setOOConfig(response.data);
    } catch (error) {
      alert("Error getting token");
      console.log("Error getting token", error);
    }
  }

  useEffect(() => {
    getOOConfig();
  }, []);

  return (
    <div className="App" style={{ height: "100vh" }}>
      <h1>Living Trust Editor</h1>
      {gettingToken ? <p>Getting token...</p> :
        <DocumentEditor
          documentServerUrl={CODESPACES_OO}
          config={ooConfig}
          id="docxEditor"
          events_onDocumentReady={onDocumentReady}
          onLoadComponentError={onLoadComponentError}
          events_onAppReady={(a, b, c) => { console.log("App is ready", { a, b, c }); }}
          events_onDocumentStateChange={(a, b, c) => { console.log("Document state changed", { a, b, c }); }}
          events_onError={(a, b, c) => { console.log("Error", { a, b, c }); }}
          events_onRequestEditRights={(a, b, c) => { console.log("Request edit rights", { a, b, c }); }}
          events_onRequestHistory={(a, b, c) => { console.log("Request history", { a, b, c }); }}
          events_onRequestHistoryClose={(a, b, c) => { console.log("Request history close", { a, b, c }); }}
          events_onRequestHistoryData={(a, b, c) => { console.log("Request history data", { a, b, c }); }}
          events_onRequestHistoryRestore={(a, b, c) => { console.log("Request history restore", { a, b, c }); }}
          events_onRequestHistoryVersions={(a, b, c) => { console.log("Request history versions", { a, b, c }); }}
          events_onRequestSaveAs={(a, b, c) => { console.log("Request save as", { a, b, c }); }}
          events_onWarning={(a, b, c) => { console.log("Warning", { a, b, c }); }}
          events_onMetaChange={(a, b, c) => { console.log("Meta change", { a, b, c }); }}
          events_onInfo={(a, b, c) => { console.log("Info", { a, b, c }); }}
        />}
    </div>
  );
}

export default App;
