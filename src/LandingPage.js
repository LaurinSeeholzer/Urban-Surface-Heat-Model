import { ArrowSmallRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className='bg-gray-50 w-full'>
        <Link to='/Urban-Surface-Heat-Model/dashboard'>
            <a href='/Urban-Surface-Heat-Model/dashboard'>
                here
        </a>
                                </Link>
    </div>
  );
}

export default LandingPage;