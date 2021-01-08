import { Point3d } from "@bentley/geometry-core";
import { Button, FillCentered } from "@bentley/ui-core";
import { StateManager } from "@bentley/ui-framework";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeMarker } from "../../store";
import { MyMarker } from "./Decoration";

export const MarkerWidget = () => {
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
