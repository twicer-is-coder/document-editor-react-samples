import { useState, useRef } from "react";
import Select from "react-select";
import { SingleValue } from "react-select/dist/declarations/src/types";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import config from "./../config/config.json";
import ContentControls from "./components/ContentControls/ContentControls";

interface Person {
  label: string;
  value?: {
    firstname: string;
    lastname: string;
    birthday: string;
  };
}

export default {
    title: "Samples/Work with forms",
    component: DocumentEditor,
    parameters: {},
    decorators: [
        (Story) => (
            <div style={{ height: "400px" }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        events_onAppReady: { action: 'onAppReady' },
        events_onDocumentReady: { action: 'onDocumentReady' },
        events_onDocumentStateChange: { action: 'onDocumentStateChange' },
        events_onError: { action: 'onError' }
    },
} as ComponentMeta<typeof DocumentEditor>;

const Template: ComponentStory<any> = (args) => {
  const [selectedPerson, setSelectedPerson] = useState<
    SingleValue<Person>
  >(null);

  const [contentControls, setContentControls] = useState<any[]>([]);

  const handleSelect = (option: SingleValue<Person>) => {
    setSelectedPerson(option);

    setFormValue("FirstName", option?.value?.firstname || "");
    setFormValue("LastName", option?.value?.lastname || "");
    setFormValue("Birthday", option?.value?.birthday || "");

    getAllContentControls();
  };

  const connectorRef = useRef<any>();

  const onDocumentReady = () => {
    try {
      var editor = window.DocEditor.instances["oformEditor"];
      var connector = editor.createConnector();

      connectorRef.current = connector;
      connector.connect();

      getAllContentControls();
      connector.attachEvent("onBlurContentControl", onBlurContentControl);
    } catch (err) {
      console.error(err);
    }
  };

  const setFormValue = (formId: string, value: string) => {
    connectorRef.current.executeMethod(
      "GetFormsByTag",
      [formId],
      (forms: any) => {
        connectorRef.current.executeMethod(
          "SetFormValue",
          [forms[0]["InternalId"], value],
          null
        );
      }
    );
  };

  const getAllContentControls = () => {
    connectorRef.current.executeMethod ("GetAllContentControls", null, function(data: any) {
      for (let i = 0; i < data.length; i++) {
        connectorRef.current.executeMethod("GetFormValue", [data[i].InternalId], (value: any) => {
            data[i].Value = value ? value : "";
            if (data.length - 1 == i) {
              setContentControls(data);
            }
        });
      }
    });
  }

  const onBlurContentControl = (oPr: { Tag?: string; InternalId?: string }) => {
    let sTag = oPr!["Tag"];
    const sensTags = [
      "FirstName",
      "LastName",
      "Birthday"
    ];

    if (sensTags.indexOf(sTag || "") !== -1) {
      setSelectedPerson({ label: "Custom data" });
    }

    getAllContentControls();
  };

  console.log({args})
  return (
    <div>
      <Select
        value={selectedPerson}
        onChange={handleSelect}
        options={args.selector.persons}
        />
      <br />

      <ContentControls contentControls={contentControls} setFormValue={setFormValue} />

      <DocumentEditor {...args.DocumentEditor}
        id="oformEditor"
        config={{
            document: {
                fileType: "oform",
                title: "demo.oform",
                url: "http://192.168.0.169:8090/plugins/servlet/onlyoffice/file-provider?vkey\u003dNGQwZWZhNWNmNDQwYTRiYWFjYzI0NTYyMDQ3Yzc4YTIxOTU0YjBjYzI4ZTgxZjRmN2RlMTBkMzdiYjE2NDljMT8zMDQ3NDQ0",
                key: "-1058610959_embedded"
            },
            documentType: "word",
        }}
        width="75%"
        height="500px"
        events_onDocumentReady={onDocumentReady}
        />
    </div>
  )
}

export const FillingFormTemplate = Template.bind({});
FillingFormTemplate.storyName = "Work with forms";
FillingFormTemplate.args = {
  DocumentEditor: {
    documentserverUrl: config.documentserverUrl,
  },
  selector: {
    persons: [
      {
        label:"John Smith",
        value: { 
          firstname: "John",
          lastname: "Smith",
          birthday: "07081988"
        }
      },
      {
        label: "Kate Cage",
        value: { 
          firstname: "Kate",
          lastname: "Cage",
          birthday: "13011988"
        }
      }
    ]
  }
};
