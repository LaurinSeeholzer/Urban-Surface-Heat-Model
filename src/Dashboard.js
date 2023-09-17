import { ArrowSmallRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import SideBar from './SideBar';

const Dashboard = () => {
    return (
        <>
            <SideBar />
            <main className="py-10 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className='grid grid-cols-1 gap-4'>
                        <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white text-center text-lg">
                            <p>Welcome to the Urban Surface Heat Model App for simulating the behavior of surface temperature in urban areas.</p>
                            <p>A Documentation will be realeasd in the comming weeks. For any questions email <a href='mailto:laurin_seeholzer@sluz.ch'>laurin_seeholzer@sluz.ch</a></p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Dashboard;