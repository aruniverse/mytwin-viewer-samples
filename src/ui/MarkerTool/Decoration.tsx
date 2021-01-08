import { XYAndZ, Point3d, Point2d } from "@bentley/geometry-core";
import { useMarker } from "@bentley/imodel-react-hooks";

interface MyMarkerProps {
    position: XYAndZ | Point3d;
  }

  export const MyMarker = ({ position }: MyMarkerProps) => {
    useMarker({
      worldLocation: position as Point3d,
      size: { x: 64, y: 64 } as Point2d,
      image: "images/minecraft_cube.svg"
    });
    return null;
  };
