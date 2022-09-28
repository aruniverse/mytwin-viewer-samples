import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AbstractWidgetProps,
  CommonToolbarItem,
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  ToolbarItemUtilities,
  ToolbarOrientation,
  ToolbarUsage,
  UiItemsProvider,
} from "@itwin/appui-abstract";
import { ReducerRegistryInstance, StateManager } from "@itwin/appui-react";
import {
  BeButtonEvent,
  EventHandled,
  IModelApp,
  PrimitiveTool,
} from "@itwin/core-frontend";
import { Point2d, Point3d, XYAndZ } from "@itwin/core-geometry";
import { FillCentered } from "@itwin/core-react";
import { useMarker } from "@itwin/imodel-react-hooks";
import { Button } from "@itwin/itwinui-react";

import { addMarker, markerSlice, removeMarker } from "./store";

interface MyMarkerProps {
  position: XYAndZ | Point3d;
}

const MyMarker = ({ position }: MyMarkerProps) => {
  useMarker({
    worldLocation: position as Point3d,
    size: { x: 64, y: 64 } as Point2d,
    image: "images/minecraft_cube.svg",
  });
  return null;
};

class MarkerTool extends PrimitiveTool {
  public static override toolId = "MarkerTool";
  public static override iconSpec = "icon-info";

  // this flyover value is actually supposed to be a key, not text. but the translator returns invalid keys
  // For a real application, see https://www.imodeljs.org/learning/frontend/localization/
  public static override get flyover() {
    return "Marker Tool";
  }
  public override async onDataButtonDown(ev: BeButtonEvent) {
    const { x, y, z } = ev.point;
    StateManager.store.dispatch(addMarker({ location: { x, y, z } }));
    return EventHandled.Yes;
  }
  public override requireWriteableTarget = () => false; // to support read-only iModels

  public async onRestartTool(): Promise<void> {
    const tool = new MarkerTool();
    if (await tool.run()) return;

    return this.exitTool();
  }
}

const MarkerWidget = () => {
  const locations = useSelector<typeof StateManager.state, Point3d[]>(
    (state: { markers: Point3d[] }) => state.markers
  );
  const dispatch = useDispatch();

  return (
    <FillCentered>
      <div>
        {locations.map(({ x, y, z }, i) => (
          <div key={`markerDeleteDiv_${i}`}>
            <Button
              onClick={() => {
                dispatch(removeMarker({ index: i }));
              }}
              key={`markerDeleteButton_${i}`}
            >
              X
            </Button>
            {`Marker ${i}: x: ${x}; y: ${y}; z: ${z};`}
          </div>
        ))}
        {locations.map((loc, i) => (
          <MyMarker key={`marker_${i}`} position={loc} />
        ))}
      </div>
    </FillCentered>
  );
};

export class MarkerToolProvider implements UiItemsProvider {
  public readonly id = "MyMarkerToolProvider";

  public constructor() {
    if (ReducerRegistryInstance.getReducers()["markers"] === undefined) {
      ReducerRegistryInstance.registerReducer("markers", markerSlice.reducer);
      MarkerTool.register();
    }
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
        "marker-tool",
        500,
        "icon-network",
        MarkerTool.flyover,
        () => {
          IModelApp.tools.run(MarkerTool.toolId);
        }
      ),
    ];
  }

  public provideWidgets(
    _stageId: string,
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
