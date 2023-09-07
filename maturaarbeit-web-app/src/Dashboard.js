import { ArrowSmallRightIcon } from '@heroicons/react/24/outline';
import React from 'react';

const Dashboard = () => {
  return (
    <div className='grid grid-cols-1 gap-4'>
        <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
            <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Build your own Simulations
                    </h2>
                </div>
                <div className="items-center flex md:ml-4 md:mt-0 gap-4">
                    <a
                        href="/surfacematerials"
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-accentcolor px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-accentcolor hover:bg-accentcolorbright"
                    >
                        <ArrowSmallRightIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Start
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;