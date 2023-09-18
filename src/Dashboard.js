import { ArrowSmallRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import SideBar from './SideBar';

const Dashboard = () => {
    return (
        <>
            <div className='grid grid-cols-1 gap-4'>
                <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white text-center text-lg">
                    <p>Welcome to the Urban Surface Heat Model App for simulating the behavior of surface temperature in urban areas.</p>
                    <p>A Documentation will be realeasd in the comming weeks. For any questions email <a href='mailto:laurin_seeholzer@sluz.ch'>laurin_seeholzer@sluz.ch</a></p>
                </div>
            </div>
        </>
    );
}

export default Dashboard;