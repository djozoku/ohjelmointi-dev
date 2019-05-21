import {
  convertFromRaw,
  convertToRaw,
  DraftHandleValue,
  Editor,
  EditorState,
  RawDraftContentState,
  RichUtils,
} from 'draft-js';
import React, { CSSProperties } from 'react';
import { ToolBar } from './Editor/Toolbar';

interface Measures {
  w: number;
  h: number;
}

interface Coordinates {
  x: number;
  y: number;
}

interface EditorComponentState {
  editorState: EditorState;
  selectionMeasures: Measures;
  selectionCoordinates: Coordinates;
  toolbarMeasures: Measures;
  windowWidth: number;
  showToolbar: boolean;
  toolbarCoordinates: Coordinates;
  showRawData: boolean;
}

class EditorComponent extends React.Component<{}, EditorComponentState> {
  public focus: () => void;
  public editor: any;
  public onChange: (EditorState) => void;
  public elemWidth: number = 0;
  public elemHeight: number = 0;
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(convertFromRaw(initialData)),
      selectionCoordinates: {
        x: 0,
        y: 0,
      },
      selectionMeasures: {
        h: 0,
        w: 0,
      },
      showRawData: false,
      showToolbar: false,
      toolbarCoordinates: {
        x: 0,
        y: 0,
      },
      toolbarMeasures: {
        h: 0,
        w: 0,
      },
      windowWidth: 0,
    };

    this.focus = () => this.editor.focus();
    this.onChange = (editorState) => this.setState({ editorState });
  }

  public onClickEditor = () => {
    this.focus();
    this.checkSelectedText();
  };

  // 1- Check if some text is selected
  public checkSelectedText = () => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const text = window.getSelection().toString();
      if (text !== '') {
        // 1-a Define the selection coordinates
        this.setSelectionXY();
      } else {
        // Hide the toolbar if nothing is selected
        this.setState({
          showToolbar: false,
        });
      }
    }
  };

  // 2- Identify the selection coordinates
  public setSelectionXY = () => {
    // @ts-ignore
    const r: DOMRect = window
      .getSelection()
      .getRangeAt(0)
      .getBoundingClientRect();
    // @ts-ignore
    const relative = document.body.parentNode.getBoundingClientRect();
    // 2-a Set the selection coordinates in the state
    this.setState(
      {
        selectionCoordinates: r,
        selectionMeasures: {
          h: r.height,
          w: r.width,
        },
        windowWidth: relative.width,
      },
      () => this.showToolbar(),
    );
  };

  // 3- Show the toolbar
  public showToolbar = () => {
    this.setState(
      {
        showToolbar: true,
      },
      () => this.measureToolbar(),
    );
  };

  // 4- The toolbar was hidden until now
  public measureToolbar = () => {
    // 4-a Define the toolbar width and height, as it is now visible
    this.setState(
      {
        toolbarMeasures: {
          h: this.elemHeight,
          w: this.elemWidth,
        },
      },
      () => this.setToolbarXY(),
    );
  };

  // 5- Now that we have all measures, define toolbar coordinates
  public setToolbarXY = () => {
    const {
      selectionMeasures,
      selectionCoordinates,
      toolbarMeasures,
      windowWidth,
    } = this.state;

    const hiddenTop = selectionCoordinates.y < toolbarMeasures.h;
    const hiddenRight =
      windowWidth - selectionCoordinates.x < toolbarMeasures.w / 2;
    const hiddenLeft = selectionCoordinates.x < toolbarMeasures.w / 2;

    const normalX =
      selectionCoordinates.x - toolbarMeasures.w / 2 + selectionMeasures.w / 2;
    const normalY = selectionCoordinates.y - toolbarMeasures.h;

    const invertedY = selectionCoordinates.y + selectionMeasures.h;
    const moveXToLeft = windowWidth - toolbarMeasures.w;
    const moveXToRight = 0;

    const coordinates: Coordinates = {
      x: normalX,
      y: normalY,
    };

    if (hiddenTop) {
      coordinates.y = invertedY;
    }

    if (hiddenRight) {
      coordinates.x = moveXToLeft;
    }

    if (hiddenLeft) {
      coordinates.x = moveXToRight;
    }

    this.setState({
      toolbarCoordinates: coordinates,
    });
  };

  public handleKeyCommand = (
    command: string,
    editorState: EditorState,
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };
  public toggleRawData = () => {
    this.setState({ showRawData: !this.state.showRawData });
  };

  public toggleToolbar = (inlineStyle: string) => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle),
    );
  };

  public render() {
    const { editorState } = this.state;
    // Make sure we're not on the ssr
    if (typeof window !== 'undefined') {
      // Let's stick the toolbar to the selection
      // when the window is resized
      window.addEventListener('resize', this.checkSelectedText);
    }

    const toolbarStyle: CSSProperties = {
      backgroundColor: 'black',
      color: 'white',
      display: this.state.showToolbar ? 'block' : 'none',
      left: this.state.toolbarCoordinates.x,
      padding: 10,
      position: 'absolute',
      top: this.state.toolbarCoordinates.y,
      zIndex: 999,
    };
    return (
      <div>
        <div
          ref={(elem) => {
            this.elemWidth = elem ? elem.clientWidth : 0;
            this.elemHeight = elem ? elem.clientHeight : 0;
          }}
          style={toolbarStyle}
        >
          <ToolBar editorState={editorState} onToggle={this.toggleToolbar} />
        </div>
        <div onClick={this.onClickEditor} onBlur={this.checkSelectedText}>
          <Editor
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder="Tell a story..."
            spellCheck={false}
            ref={(element) => {
              this.editor = element;
            }}
          />
        </div>
        <div style={{ marginTop: 40 }}>
          <button onClick={this.toggleRawData}>
            {!this.state.showRawData ? 'Show' : 'Hide'} Raw Data
          </button>
          <br />
          {this.state.showRawData &&
            JSON.stringify(convertToRaw(editorState.getCurrentContent()))}
        </div>
      </div>
    );
  }
}

// Custom overrides for each style
const styleMap = {
  BOLD: {
    color: '#395296',
    fontWeight: 'bold',
  },
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 4,
  },
};

const initialData: RawDraftContentState = {
  blocks: [
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [{ offset: 0, length: 23, style: 'BOLD' }],
      key: '16d0k',
      text: 'You can edit this text.',
      type: 'unstyled',
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: '98peq',
      text: '',
      type: 'unstyled',
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [
        { offset: 0, length: 14, style: 'BOLD' },
        { offset: 133, length: 9, style: 'BOLD' },
      ],
      key: 'ecmnc',
      text:
        'Luke Skywalker has vanished. In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire and will not rest until Skywalker, the last Jedi, has been destroyed.',
      type: 'unstyled',
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: 'fe2gn',
      text: '',
      type: 'unstyled',
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [
        { offset: 34, length: 19, style: 'BOLD' },
        { offset: 117, length: 4, style: 'BOLD' },
        { offset: 68, length: 10, style: 'ITALIC' },
      ],
      key: '4481k',
      text:
        'With the support of the REPUBLIC, General Leia Organa leads a brave RESISTANCE. She is desperate to find her brother Luke and gain his help in restoring peace and justice to the galaxy.',
      type: 'unstyled',
    },
  ],
  entityMap: {},
};

export default EditorComponent;
