import { DraftInlineStyleType } from 'draft-js';
import React from 'react';

interface ToolbarButtonProps {
  onToggle: (inlineStyle: string) => void;
  style: DraftInlineStyleType;
  label: string;
  active: boolean;
}

class ToolbarButton extends React.Component<ToolbarButtonProps> {
  constructor(props) {
    super(props);
  }

  public onToggle = (e) => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

  public render() {
    const buttonStyle = {
      padding: 10,
    };
    return (
      <span onMouseDown={this.onToggle} style={buttonStyle}>
        {this.props.label}
      </span>
    );
  }
}

interface ToolbarItem {
  label: string;
  style: DraftInlineStyleType;
}

const toolbarItems: ToolbarItem[] = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Code', style: 'CODE' },
];

export const ToolBar = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div>
      {toolbarItems.map((toolbarItem) => (
        <ToolbarButton
          key={toolbarItem.label}
          active={currentStyle.has(toolbarItem.style)}
          label={toolbarItem.label}
          onToggle={props.onToggle}
          style={toolbarItem.style}
        />
      ))}
    </div>
  );
};
