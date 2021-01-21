import React from "react";
import { Marker } from "@bentley/imodel-react-hooks";
import { useAsyncEffect } from "@bentley/react-hooks";
import { Point3d } from "@bentley/geometry-core";

export default function TankMarker({tankParamType}: {tankParamType: "level" | "pressure"}) {
  const [tankParamValue, setTankParamValue] = React.useState<number>();

  useAsyncEffect(
    async ({ isStale, setCancel }) => {
      const aborter = new AbortController();
      setCancel(() => aborter.abort());
      const response = await fetch("http://localhost:3001/tank-params", { signal: aborter.signal });
      const result = await response.json();
      if (!isStale()) setTankParamValue(result[tankParamType]);
    },
    [tankParamType],
  ).catch((err) => {
    if (err.name !== "AbortError") console.error(err);
  });

  if (tankParamValue === undefined) return <> loading </>;
  const fillHeight = 9 * tankParamValue;
  const fillColor = (tankParamType === "level"
    ? tankParamValue > 0.5 ? "green" : "red"
    : tankParamValue > 0.7 ? "purple" : "blue");
  return (
    <Marker
      worldLocation={Point3d.create(32775.78, 31851.17, 0)}
      jsxElement={
        <svg width="100px" height="80px" viewBox="-1 -1 20 12" transform="scale(1, -1)">
          <rect x={0} y={0} width={5} height={10} rx={1} stroke="black" strokeWidth={1} fill="none" />
          <rect x={0.25} y={0.5} width={4.5} height={fillHeight} rx={0.5} fill={fillColor} style={{transition: "all 0.4s"}}  />
          <text x={6} y={-6} transform="scale(1, -1)" fontSize="2pt">{tankParamType}</text>
          <text x={6} y={-2} transform="scale(1, -1)" fontSize="2pt">{tankParamValue.toFixed(2)}</text>
        </svg>
      }
    />
  );
}
