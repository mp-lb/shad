import { useMemo } from "react";

import {
  DotmSquare1,
  DotmSquare2,
  DotmSquare3,
  DotmSquare4,
  DotmSquare5,
  DotmSquare6,
  DotmSquare7,
  DotmSquare8,
  DotmSquare9,
  DotmSquare10,
  DotmSquare11,
  DotmSquare12,
  DotmSquare13,
  DotmSquare14,
  DotmSquare15,
  DotmSquare16,
  DotmSquare17,
  DotmSquare18,
  DotmSquare19,
  DotmSquare20,
} from "./dotm-squares";
import type { DotMatrixCommonProps } from "./dotmatrix-core";
import { cn } from "@/lib/utils";

type DotmLoadingProps = {
  "aria-label"?: string;
  ariaLabel?: string;
  className?: string;
  dotSize?: number;
  size?: number;
};

const dotmLoaderDefaults = {
  animated: true,
  dotSize: 2,
  size: 18,
} satisfies DotMatrixCommonProps;

const renderDotmSquare = (dotmIndex: number, props: DotMatrixCommonProps) => {
  switch (dotmIndex) {
    case 1:
      return <DotmSquare1 {...props} />;
    case 2:
      return <DotmSquare2 {...props} />;
    case 3:
      return <DotmSquare3 {...props} />;
    case 4:
      return <DotmSquare4 {...props} />;
    case 5:
      return <DotmSquare5 {...props} />;
    case 6:
      return <DotmSquare6 {...props} />;
    case 7:
      return <DotmSquare7 {...props} />;
    case 8:
      return <DotmSquare8 {...props} />;
    case 9:
      return <DotmSquare9 {...props} />;
    case 10:
      return <DotmSquare10 {...props} />;
    case 11:
      return <DotmSquare11 {...props} />;
    case 12:
      return <DotmSquare12 {...props} />;
    case 13:
      return <DotmSquare13 {...props} />;
    case 14:
      return <DotmSquare14 {...props} />;
    case 15:
      return <DotmSquare15 {...props} />;
    case 16:
      return <DotmSquare16 {...props} />;
    case 17:
      return <DotmSquare17 {...props} />;
    case 18:
      return <DotmSquare18 {...props} />;
    case 19:
      return <DotmSquare19 {...props} />;
    default:
      return <DotmSquare20 {...props} />;
  }
};

export function DotmLoading({
  "aria-label": ariaLabelProp,
  ariaLabel,
  className,
  dotSize = dotmLoaderDefaults.dotSize,
  size = dotmLoaderDefaults.size,
}: DotmLoadingProps) {
  // eslint-disable-next-line react-hooks/purity
  const dotmIndex = useMemo(() => Math.floor(Math.random() * 20) + 1, []);
  const label = ariaLabel ?? ariaLabelProp ?? "Loading";

  return (
    <div className={cn("flex min-h-0 items-center justify-center", className)}>
      {renderDotmSquare(dotmIndex, {
        ...dotmLoaderDefaults,
        ariaLabel: label,
        dotSize,
        size,
      })}
    </div>
  );
}
