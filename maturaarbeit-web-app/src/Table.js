import React, { useEffect } from 'react';

export default function Table({ surfaceData, deleteSurface }) {

    return (
        <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Hex-Color
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Boundary
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Density
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Albedo
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Heatcapacity
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Thermalconductivity
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Evapotranspiration (m/day)
                                    </th>
                                    <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {surfaceData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{item.name}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.hexcolor}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.boundary}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.density}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.albedo}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.heatcapacity}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.thermalconductivity}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.evapotranspiration}</td>
                                        <td onClick={() => deleteSurface(item.id)} className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 text-indigo-600">
                                            delete
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
