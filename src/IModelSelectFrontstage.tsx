import { IModelInfo, IModelSelector } from "@bentley/imodel-select-react";
import {
  BackstageAppButton,
  ConfigurableCreateInfo,
  ContentControl,
  ContentGroup,
  ContentLayoutDef,
  CoreTools,
  Frontstage,
  FrontstageProps,
  FrontstageProvider,
  ToolWidgetComposer,
  Widget,
  Zone,
} from "@bentley/ui-framework";
import * as React from "react";

class IModelSelectorControl extends ContentControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);

    this.reactNode = <IModelSelector onIModelSelected={this._onSelectIModel} />;
  }

  // called when an imodel has been selected on the IModelSelect
  private _onSelectIModel = async (iModelInfo: IModelInfo) => {
    localStorage.setItem(
      "mytwin-viewer.contextId",
      iModelInfo.projectInfo.wsgId
    );
    localStorage.setItem("mytwin-viewer.iModelId", iModelInfo.wsgId);
    window.dispatchEvent(new Event("mytwin-viewer.localStorageUpdated"));
  };
}

export class IModelSelectFrontstage extends FrontstageProvider {
  // Content layout for content views
  private _contentLayoutDef: ContentLayoutDef;

  constructor() {
    super();

    // Create the content layouts.
    this._contentLayoutDef = new ContentLayoutDef({});
  }

  public get frontstage(): React.ReactElement<FrontstageProps> {
    const contentGroup: ContentGroup = new ContentGroup({
      contents: [
        {
          classId: IModelSelectorControl,
        },
      ],
    });

    return (
      <Frontstage
        id="IModelSelector"
        defaultTool={CoreTools.selectElementCommand}
        defaultLayout={this._contentLayoutDef}
        contentGroup={contentGroup}
        isInFooterMode={false}
        contentManipulationTools={
          <Zone
            widgets={[
              <Widget
                isFreeform={true}
                element={
                  <ToolWidgetComposer cornerItem={<BackstageAppButton />} />
                }
              />,
            ]}
          />
        }
      />
    );
  }
}
