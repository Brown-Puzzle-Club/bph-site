import SVGBoard from "@/components/major_cases/colored-thread/SVGBoard";
import { useTheme } from "@/hooks/useTheme";
import { BROWN_THEME } from "@/utils/themes";
import { useEffect } from "react";
import SVGBoard from "@/components/major_cases/colored-thread/SVGBoard";
import { useTheme } from "@/hooks/useTheme";
import { BROWN_THEME } from "@/utils/themes";
import { useEffect } from "react";

export default function ColoredThread() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(BROWN_THEME);
  });

  // return <Board />;
  return <SVGBoard />;
}
