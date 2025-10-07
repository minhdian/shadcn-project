// import React from "react";
import {
  FileManagerComponent,
  Inject,
  NavigationPane,
  DetailsView,
  Toolbar
} from "@syncfusion/ej2-react-filemanager";
/* Syncfusion File Manager CSS */
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-icons/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-layouts/styles/material.css';
import '@syncfusion/ej2-grids/styles/material.css';
import '@syncfusion/ej2-filemanager/styles/material.css';
export const FileManagerWP = () => {
  let hostUrl: string = 'http://wordpress-media-api.test/wp-json/filester/v1/filemanager';
  
  return (
    <div className="control-pane">
      <div className="control-section">
        <FileManagerComponent 
          id="file" 
          ajaxSettings={{
            url: hostUrl,            // single endpoint; ej2 sẽ gửi action trong body
           // nếu ej2 needs separate uploadUrl, you can still set uploadUrl to same hostUrl
           uploadUrl: hostUrl,
           downloadUrl: hostUrl, // bạn có thể thêm sau
          }}
          height="400px"
          width={"100%"}
          style={{ backgroundColor: "#eee" }}
          view="Details"
          showThumbnail={false}
          allowMultiSelection={true}
        >
          <Inject services={[NavigationPane, DetailsView, Toolbar]} />
        </FileManagerComponent>
      </div>
    </div>
  );
};

