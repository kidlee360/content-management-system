"use client";
import { useState } from "react";




export default function Header({bClicked}: any) {

  const [buttonClick, setButtonClicked] = useState<string | null>(null);

  const buttonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    setButtonClicked(event.currentTarget.textContent);// the .currentTarget is used to access the element that triggered the event in this case, the button
    bClicked(event.currentTarget.textContent);
    console.log("Publish Post button clicked");
  }

    return (
        <header className="flex justify-between items-center mb-8 border-b pb-4 bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">New Article</h1>
            <div className="space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium" onClick={buttonClicked}>Save Draft</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
              onClick={buttonClicked}>
                Publish Post
              </button>
            </div>
        </header>
    );
}