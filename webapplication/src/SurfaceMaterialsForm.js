import { PlusIcon } from '@heroicons/react/24/outline'
import InputField from './InputField'

export default function SurfaceMaterialsForm({ addSurface }) {

    return (
        <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <InputField id="name" placeholder="asphalt" label="Name" type="text" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField id="color" placeholder="rgb(0,0,0)" label="Color" type="text" />
                            </div>
                            <div className="sm:col-span-1">
                                <InputField id="boundary" placeholder="true / false" label="Boundary" type="text" />
                            </div>
                            <div className="sm:col-span-1">
                                <InputField id="airresistence" placeholder="0.0 - 1.0" label="Arresistence" type="text" />
                            </div>
                            <div className="sm:col-span-1">
                                <InputField id="density" placeholder="2200" label="Density (kg/m^3)" type="number" />
                            </div>
                            <div className="sm:col-span-1">
                                <InputField id="albedo" placeholder="0.0 - 0.1" label="Albedo" type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField id="heatcapacity" placeholder="920" label="Heatcapacity (J/(kg K)" type="number" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField id="thermalconductivity" placeholder="0.75" label="Thermalconductivity (W/(m K))" type="number" />
                            </div>
                            <div className="sm:col-span-6">
                                <InputField id="evapotranspiration" placeholder="0.002" label="Evapotranspiration (m/day)" type="number" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    onClick={addSurface}
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-accentcolor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accentcolorbright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentcolor"
                >
                    Create New Surface
                    <PlusIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </div>

    )
}
