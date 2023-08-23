import { ArrowSmallLeftIcon, ArrowSmallRightIcon } from '@heroicons/react/20/solid'

export default function PageTitle({ title, back, next }) {
    return (
        <div className="p-4 sm:p-6 lg:p-8 rounded-lg shadow bg-white">
            <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {title}
                    </h2>
                </div>
                <div className="items-center flex md:ml-4 md:mt-0 gap-4">
                    <a
                        href={back}
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <ArrowSmallLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Back
                    </a>
                    <a
                        href={next}
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Next
                        <ArrowSmallRightIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </div>
    )
}
