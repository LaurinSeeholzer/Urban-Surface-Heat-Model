import React from 'react';

export default function InputField(props) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900">
        {props.label}
      </label>
      <div className="mt-2">
        <input
          type={props.type}
          name={props.id}
          id={props.id}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          defaultValue={props.defaultValue}
          onChange={props.onChange}
        />
      </div>
    </div>
  )
}
