import React from "react";
import Select from "react-select";
import monacoThemes from "monaco-themes/themes/themelist";

const ThemeDropdown = ({ handleThemeChange, theme }) => {
  return (
    <Select
      placeholder={`Select Theme`}
      // options={languageOptions}
      options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
        label: themeName,
        value: themeId,
        key: themeId,
      }))}
      value={theme.value}
      onChange={handleThemeChange}
      isSearchable={false}
    />
  );
};

export default ThemeDropdown;