import { DEFAULT_THEME, Theme } from "@/utils/themes";
import { ReactNode, createContext, useContext, useState } from "react";
import { DEFAULT_THEME, Theme } from "@/utils/themes";
import { ReactNode, createContext, useContext, useState } from "react";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
