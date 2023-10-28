import React, { useEffect, useState } from 'react';
import './TextEditor.scss';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

type Props = {
  setText: (content: string) => void;
  beforeText?: string;
};

const TextEditor: React.FC<Props> = ({ setText, beforeText }) => {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const handleEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const content = JSON.stringify(convertToRaw(contentState));
    setText(content);
  };
  
  useEffect(() => {
    if (beforeText) {
      const parsedContentState = convertFromRaw(JSON.parse(beforeText));
      const newEditorState = EditorState.createWithContent(parsedContentState);
      handleEditorStateChange(newEditorState);
      setEditorState(newEditorState);
    }
  }, [beforeText]);

  return (
    <div className='textEditor'>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        placeholder='投稿内容を記入してください。'
        wrapperClassName='editor-wrapper'
        editorClassName='editor'
        toolbarClassName='toolbar'
        localization={{
          locale: 'ja',
        }}
        toolbar={{
          // options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
          options: ['inline', 'list', 'remove', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript']
          }
          // blockType: {
          //   inDropdown: true,
          //   options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
          //   className: 'blockType',
          // },
          // fontSize: {
          //   inDropdown: true,
          //   options: [8, 10, 12, 14, 16, 18, 20, 24],
          //   className: 'fontSize',
          // },
          // fontFamily: {
          //   inDropdown: true,
          //   options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
          //   className: 'fontFamily',
          // },
        }}
      />
    </div>
  );
};

export default TextEditor;
