import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function CheckFeed({ feedData }) {

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {feedData.map((item, index) => (
                    <li key={item.text}>
                        <div className="relative pb-8">
                            <div className="relative flex space-x-3">
                                <div>
                                    {!item.value ?
                                        <span className='bg-indigo-300 h-8 w-8 rounded-lg flex items-center justify-center ring-8 ring-white'>
                                            <ExclamationCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                        </span>
                                        : <span className='bg-indigo-600 h-8 w-8 rounded-lg flex items-center justify-center ring-8 ring-white'>
                                            <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                        </span>
                                    }
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div >
    )
}
