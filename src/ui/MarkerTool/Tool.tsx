import { PrimitiveTool, BeButtonEvent, EventHandled } from "@bentley/imodeljs-frontend";
import { StateManager } from "@bentley/ui-framework";
import { addMarker } from "../../store";

export class MarkerTool extends PrimitiveTool {
    public static toolId = "MarkerTool";
    public static iconSpec = "icon-info";

    // this flyover value is actually supposed to be a key, not text. but the translator returns invalid keys
    // For a real application, see https://www.imodeljs.org/learning/frontend/localization/
    public static get flyover() {
      return "Marker Tool";
    }
    public async onDataButtonDown(ev: BeButtonEvent) {
      const { x, y, z } = ev.point;
      StateManager.store.dispatch(addMarker({ location: { x, y, z } }));
      return EventHandled.Yes;
    }
    public requireWriteableTarget = () => false; // to support read-only iModels

    public onRestartTool(): void {
      const tool = new MarkerTool();
      if (!tool.run()) {
        this.exitTool();
      }
    }
  }