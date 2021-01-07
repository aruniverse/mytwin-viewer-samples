import { IModelApp } from "@bentley/imodeljs-frontend";
import { I18N } from "@bentley/imodeljs-i18n";
import {
  AbstractWidgetProps,
  CommonToolbarItem,
  StagePanelLocation,
  StagePanelSection,
  ToolbarItemUtilities,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import {
  StageUsage,
  ToolbarUsage,
  ToolbarOrientation,
} from "@bentley/ui-abstract";
import { ReducerRegistryInstance } from "@bentley/ui-framework";
import React from "react";
import { markerSlice } from "../../store";
import { MarkerTool } from "./Tool";
import { MarkerWidget } from "./Widget";

export class MyMarkerToolProvider implements UiItemsProvider {
  public readonly id = "MyMarkerToolProvider";
  public static i18n: I18N;

  public constructor(i18n: I18N) {
    MyMarkerToolProvider.i18n = i18n;
    ReducerRegistryInstance.registerReducer("markers", markerSlice.reducer);
    MarkerTool.namespace = IModelApp.i18n.registerNamespace("MyViewer App");
    IModelApp.tools.register(MarkerTool);
  }

  public provideToolbarButtonItems(
    _stageId: string,
    stageUsage: string,
    toolbarUsage: ToolbarUsage,
    toolbarOrientation: ToolbarOrientation
  ): CommonToolbarItem[] {
    if (
      stageUsage !== StageUsage.General ||
      toolbarUsage !== ToolbarUsage.ContentManipulation ||
      toolbarOrientation !== ToolbarOrientation.Vertical
    ) {
      return [];
    }

    return [
      ToolbarItemUtilities.createActionButton(
        "mymarkertool-test",
        100,
        "icon-info",
        "Window Alert",
        () => {
          window.alert("clicked");
        }
      ),
      ToolbarItemUtilities.createActionButton(
        "marker-tool",
        101,
        "icon-network",
        MarkerTool.flyover,
        () => {
          IModelApp.tools.run(MarkerTool.toolId);
        }
      ),
    ];
  }

  public provideWidgets(
    stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection | undefined
  ): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];
    if (
      stageUsage === StageUsage.General &&
      location === StagePanelLocation.Right &&
      section === StagePanelSection.Start
    ) {
      widgets.push({
        id: "mymarker-widget",
        label: "mymarker-widget",
        getWidgetContent: () => <MarkerWidget />,
      });
    }
    return widgets;
  }
}
