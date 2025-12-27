"use client";
import React, { useState, useEffect } from "react";
import ContentEditor from "./contentEditor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Block {
  id: number;
  type: string;
  content: any;
}

const Blog: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    // Fetch initial data or load from local storage
  }, []);

  const handleAddBlock = (type: string) => {
    const newBlock: Block = { id: Date.now(), type, content: "" };
    setBlocks([...blocks, newBlock]);
  };

  const handleDeleteBlock = (id: number) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const handleMoveBlock = (fromIndex: number, toIndex: number) => {
    const updatedBlocks = [...blocks];
    const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(updatedBlocks);
  };

  const handleUpdateBlock = (id: number, content: string) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, content } : block
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Blog Editor</h1>
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <ContentEditor
              key={block.id}
              index={index}
              block={block}
              onDelete={handleDeleteBlock}
              onMove={handleMoveBlock}
              onUpdate={handleUpdateBlock}
            />
          ))}
        </div>
        <div className="mt-8">
          <button
            onClick={() => handleAddBlock("text")}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          >
            Add Text Block
          </button>
          <button
            onClick={() => handleAddBlock("image")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Image Block
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Blog;
