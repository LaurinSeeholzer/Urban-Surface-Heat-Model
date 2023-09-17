import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  AdjustmentsHorizontalIcon,
  TableCellsIcon,
  HomeIcon,
  XMarkIcon,
  RocketLaunchIcon,
  MapIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/Urban-Surface-Heat-Model/dashboard', icon: HomeIcon},
  { name: 'Surface Materials', href: '/Urban-Surface-Heat-Model/surfacematerials', icon: TableCellsIcon},
  { name: 'Simulation Settings', href: '/Urban-Surface-Heat-Model/simulationsettings', icon: AdjustmentsHorizontalIcon},
  { name: 'Map Editor', href: '/Urban-Surface-Heat-Model/mapeditor', icon: MapIcon},
  { name: 'Run Simulation', href: '/Urban-Surface-Heat-Model/runsimulation', icon: RocketLaunchIcon},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation();

  const currentPage = navigation.find((item) => item.href === location.pathname);
  const currentPageTitle = currentPage.name

  return (
    <>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <div className="flex">
                        <img src='logo-breit.svg' className='w-full py-8'></img>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link to={item.href}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    location.pathname === item.href
                                      ? 'bg-gray-50 text-accentcolor'
                                      : 'text-gray-700 hover:text-accentcolor hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                        location.pathname === item.href ? 'text-accentcolor' : 'text-gray-400 group-hover:text-accentcolor',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex">
                <img src='logo-breit.svg' className='w-full py-10'></img>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href}>
                        <a
                          href={item.href}
                          className={classNames(
                            location.pathname === item.href
                              ? 'bg-gray-50 text-accentcolor'
                              : 'text-gray-700 hover:text-accentcolor hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                                location.pathname === item.href ? 'text-accentcolor' : 'text-gray-400 group-hover:text-accentcolor',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            {currentPageTitle}
          </div>
        </div>
    </>
  )
}
