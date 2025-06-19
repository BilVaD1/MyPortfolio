import React from 'react'

const ExperienceItem = ({ item }) => {
  return (
    <div
      className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 w-full max-w-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
      <div className="mb-4">
        <p className="italic text-lg text-gray-500 dark:text-gray-300 mb-1">Project Description:</p>
        <p className="text-xl font-medium text-gray-800 dark:text-gray-100">{item.description}</p>
      </div>
      <div className="mb-4">
        <p className="italic text-lg text-gray-500 dark:text-gray-300 mb-1">Role:</p>
        <p className="text-xl font-semibold text-orange-500 dark:text-yellow-300">{item.role}</p>
      </div>
      <div>
        <p className="italic text-lg text-gray-500 dark:text-gray-300 mb-2">Responsibilities:</p>
        <ul className="list-disc pl-6">
          {item.responsibilities.map((responsibility, index) => (
            <li
              key={index}
              className="mb-2 text-base text-gray-700 dark:text-gray-200"
            >
              {responsibility}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExperienceItem