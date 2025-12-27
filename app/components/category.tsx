"use client";
import { useState } from "react";


export default function Category( {categoryChange}: any) {

  const [category, setCategory] = useState("General");

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setCategory(event.target.value);
    categoryChange(event.target.value);
  }

    return (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Post Settings</h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleChange}>
                <option>General</option>
                <option>Technology</option>
                <option>Business</option>
                <option>Marketing</option>
              </select>
            </div>
        </section>
    );
};