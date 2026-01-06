import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { LuTrash2 } from 'react-icons/lu';

const ImageComponent = ({ node, updateAttributes, deleteNode, selected }: any) => {
  const handleResize = (direction: number) => {
    const currentWidth = parseInt(node.attrs.width) || 300;
    updateAttributes({ width: `${currentWidth + direction}px` });
  };

  const isCenter = node.attrs.float === 'center';
  const wrapperClass = `relative group ${selected ? 'ring-2 ring-blue-500' : ''} ${node.attrs.float === 'left' ? 'float-left mr-4' : node.attrs.float === 'right' ? 'float-right ml-4' : isCenter ? 'w-full flex justify-center' : 'inline-block'}`;

  return (
    <NodeViewWrapper className={wrapperClass}>
      <div>
        <img
          src={node.attrs.src}
          style={{ width: node.attrs.width, height: 'auto' }}
          className={`rounded-lg resizable-image ${isCenter ? 'mx-auto block' : 'block'}`}
        />
        
        {/* Delete Button - Appears on Hover or Selection */}
        <button
          onClick={deleteNode}
          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <LuTrash2 size={16} />
        </button>

        {/* Resize Handle */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = parseInt(node.attrs.width) || 300;

            const onMouseMove = (mouseMoveEvent: MouseEvent) => {
              const newWidth = startWidth + (mouseMoveEvent.clientX - startX);
              updateAttributes({ width: `${newWidth}px` });
            };

            const onMouseUp = () => {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize rounded-tl-sm opacity-0 group-hover:opacity-100"
        />
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImage = Image.extend({
  addAttributes() {
  return {
    ...this.parent?.(),
    width: {
      default: '300px',
      // This logic ensures that every time Tiptap saves, 
      // it writes a perfect CSS style string.
      renderHTML: (attributes) => {
        return {
          style: `width: ${attributes.width}; float: ${attributes.float || 'none'}; height: auto;`,
        };
      },
    },
    float: {
      default: 'none',
      // We keep the attribute in the background so the editor 
      // can "remember" the state of the buttons.
    },
  };
},
  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});