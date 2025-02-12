import React, { ReactNode } from "react";

interface CodeEditorLayout {
  children: ReactNode;
}

const CodeEditorLayout: React.FC<CodeEditorLayout> = ({ children }) => {
  return <div>{children}</div>;
};

export default CodeEditorLayout;
