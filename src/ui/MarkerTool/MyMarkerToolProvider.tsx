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
import { FillCentered } from "@bentley/ui-core";
import React from "react";

export class MyMarkerToolProvider implements UiItemsProvider {
  public readonly id = "MyMarkerToolProvider";
  public static i18n: I18N;

  public constructor(i18n: I18N) {
    MyMarkerToolProvider.i18n = i18n;
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
        101,
        "icon-info",
        "Window Alert",
        () => {
          window.alert("clicked");
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
        getWidgetContent: () => (
          <FillCentered>
            <div>{"hello world"}</div>
          </FillCentered>
        ),
      });
    }
    return widgets;
  }
}
