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
import { Point2d, Point3d } from "@itwin/core-geometry";
import { FillCentered } from "@itwin/core-react";
import { useMarker } from "@itwin/imodel-react-hooks";
import { Tag } from "@itwin/itwinui-react";

import { addMarker, markerSlice, removeMarker } from "./store";

interface MyMarkerProps {
  position: Point3d;
}

const MyMarker = ({ position }: MyMarkerProps) => {
  useMarker({
    worldLocation: position,
    size: { x: 64, y: 64 } as Point2d,
    image: "images/minecraft_cube.svg",
  });
  return null;
};

class MarkerTool extends PrimitiveTool {
  public static override toolId = "MarkerTool";
  public static override iconSpec = "icon-info";

  // this flyover value is actually supposed to be a key, not text. but the translator returns invalid keys
  public static override get flyover() {
    return "Marker Tool";
  }
  public override async onDataButtonDown(ev: BeButtonEvent) {
    StateManager.store.dispatch(addMarker({ location: ev.point }));
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
        {locations.map((_pt, i) => (
          <div key={`markerDeleteDiv_${i}`}>
            <Tag
              key={`markerDeleteButton_${i}`}
              onRemove={() => {
                dispatch(removeMarker({ index: i }));
              }}
            >{`Marker ${i}`}</Tag>
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
      MarkerTool.register("mytwin-viewer-samples");
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
