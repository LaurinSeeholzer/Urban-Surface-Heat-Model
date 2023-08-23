import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline'

import InputField from './InputField'

export default function SurfaceMaterialsForm({ addSurface }) {

    return (
        <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <InputField id="name" label="Name" type="text" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField id="hexcolor" label="Hex Color" type="text" />
                            </div>
                            <div className="sm:col-span-1">
                                <InputField id="boundary" label="Boundary" type="text" />
                            </div>
                            <div className="sm:col-span-1">
                                <InputField id="density" label="Density" type="number" />
                            </div>
                            <div className="sm:col-span-1">
                                <InputField id="albedo" label="Albedo" type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField id="heatcapacity" label="Heatcapacity" type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField id="thermalconductivity" label="Thermalconductivity" type="number" />
                            </div>
                            <div className="sm:col-span-6">
                                <InputField id="evapotranspiration" label="Evapotranspiration" type="number" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    onClick={addSurface}
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Create New Surface
                    <PlusIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </div>

    )
}
