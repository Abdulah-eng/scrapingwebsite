'use client'

import { useState, useEffect } from 'react'
import { Search, Building2, Key, Globe, Info, X, User, Mail, Phone, MapPin } from 'lucide-react'
import { supabase, ColonyWithContacts } from '@/lib/supabase'
import Link from 'next/link'

type ViewMode = 'home' | 'colonies' | 'register' | 'regions' | 'more' | 'colony-detail' | 'region-detail'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [colonies, setColonies] = useState<ColonyWithContacts[]>([])
  const [filteredColonies, setFilteredColonies] = useState<ColonyWithContacts[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewMode>('home')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [selectedColony, setSelectedColony] = useState<ColonyWithContacts | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  useEffect(() => {
    fetchColonies()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredColonies(colonies)
    } else {
      const filtered = colonies.filter(colony =>
        colony.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colony.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredColonies(filtered)
    }
  }, [searchTerm, colonies])

  const fetchColonies = async () => {
    try {
      const { data: coloniesData, error: coloniesError } = await supabase
        .from('colonies')
        .select(`
          *,
          contacts (*)
        `)
        .order('name')

      if (coloniesError) throw coloniesError

      setColonies(coloniesData || [])
      setFilteredColonies(coloniesData || [])
    } catch (error) {
      console.error('Error fetching colonies:', error)
    } finally {
      setLoading(false)
    }
  }

  const getContactInfo = (colony: ColonyWithContacts) => {
    const switchboard = colony.contacts.find(c => c.contact_type === 'switchboard')
    const manager = colony.contacts.find(c => c.contact_type === 'manager')
    const minister = colony.contacts.find(c => c.contact_type === 'minister')
    const postal = colony.contacts.find(c => c.contact_type === 'postal')

    return { switchboard, manager, minister, postal }
  }

  const handleButtonClick = (view: ViewMode) => {
    setCurrentView(view)
    if (view === 'register') {
      setShowRegisterModal(true)
    } else if (view === 'more') {
      setShowMoreMenu(!showMoreMenu)
    } else {
      setShowMoreMenu(false)
    }
  }

  const getRegions = () => {
    const regions = new Set(colonies.map(colony => colony.location))
    return Array.from(regions).sort()
  }

  const handleColonyClick = (colony: ColonyWithContacts) => {
    setSelectedColony(colony)
    setCurrentView('colony-detail')
  }

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region)
    setCurrentView('region-detail')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-gray-900">Members</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>3.8550</span>
                <span>85% Colonies</span>
                <span>Regions</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Register</span>
              <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">More</span>
              <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Business</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar - Exact Structure Match */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="search everything ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="zn block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

            {/* Main Buttons Grid - Exact Structure Match */}
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
              {/* Colonies Button */}
              <div className="f">
                <div className="e ut flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="y">
                  <button
                    onClick={() => handleButtonClick('colonies')}
                    className={`w-full p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                      currentView === 'colonies' ? 'bg-blue-50 border-blue-300' : 'bg-white'
                    }`}
                  >
                    <p className="text-lg font-medium text-gray-900">Colonies</p>
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <div className="f">
                <div className="e ik flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2">
                  <Key className="h-6 w-6 text-blue-600" />
                </div>
                <div className="y">
                  <button
                    onClick={() => handleButtonClick('register')}
                    className="w-full p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-lg font-medium text-gray-900">Register</p>
                  </button>
                </div>
              </div>

              {/* Regions Button */}
              <div className="f">
                <div className="e uo flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div className="y">
                  <button
                    onClick={() => handleButtonClick('regions')}
                    className={`w-full p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                      currentView === 'regions' ? 'bg-blue-50 border-blue-300' : 'bg-white'
                    }`}
                  >
                    <p className="text-lg font-medium text-gray-900">Regions</p>
                  </button>
                </div>
              </div>

              {/* More Button */}
              <div className="f relative">
                <div className="e dh flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div className="y">
                  <button
                    onClick={() => handleButtonClick('more')}
                    className="w-full p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-lg font-medium text-gray-900">More</p>
                  </button>
                </div>

                {/* More Menu Dropdown */}
                {showMoreMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Help
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        About
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Contact
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

        {/* Dynamic Content Based on Current View */}
        {currentView === 'colonies' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All Colonies</h2>
              <p className="text-gray-600">Browse through all available colonies</p>
            </div>
            
            {/* Colonies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colonies.map((colony) => {
                const { switchboard, manager, minister, postal } = getContactInfo(colony)
                
                return (
                  <div 
                    key={colony.id} 
                    onClick={() => handleColonyClick(colony)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{colony.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{colony.location}</p>
                    
                    <div className="space-y-2">
                      {switchboard && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>Switchboard: {switchboard.phone || 'Available'}</span>
                        </div>
                      )}
                      
                      {manager && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>Manager: {manager.name}</span>
                        </div>
                      )}
                      
                      {colony.coordinates && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{colony.coordinates}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-sm text-blue-600 font-medium">
                      Click to view details →
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {currentView === 'regions' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Colonies by Region</h2>
              <p className="text-gray-600">Explore colonies organized by geographic regions</p>
            </div>
            
            {/* Regions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRegions().map((region) => {
                const regionColonies = colonies.filter(colony => colony.location === region)
                
                return (
                  <div 
                    key={region} 
                    onClick={() => handleRegionClick(region)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{region}</h3>
                    <p className="text-sm text-gray-600 mb-4">{regionColonies.length} colonies</p>
                    
                    <div className="space-y-2">
                      {regionColonies.slice(0, 3).map((colony) => (
                        <div key={colony.id} className="text-sm text-gray-600">
                          {colony.name}
                        </div>
                      ))}
                      {regionColonies.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{regionColonies.length - 3} more colonies
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 text-sm text-blue-600 font-medium">
                      Click to view all colonies in this region →
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Colony Detail View */}
        {currentView === 'colony-detail' && selectedColony && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('colonies')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                ← Back to Colonies
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedColony.name}</h2>
              <p className="text-lg text-gray-600 mb-6">{selectedColony.location}</p>
              
              {selectedColony.coordinates && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{selectedColony.coordinates}</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {getContactInfo(selectedColony).switchboard && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <div className="font-medium">Switchboard</div>
                          <div className="text-gray-600">{getContactInfo(selectedColony).switchboard?.phone || 'Available'}</div>
                        </div>
                      </div>
                    )}
                    
                    {getContactInfo(selectedColony).manager && (
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <div className="font-medium">Manager</div>
                          <div className="text-gray-600">{getContactInfo(selectedColony).manager?.name}</div>
                        </div>
                      </div>
                    )}
                    
                    {getContactInfo(selectedColony).minister && (
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <div className="font-medium">Minister</div>
                          <div className="text-gray-600">{getContactInfo(selectedColony).minister?.name}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-gray-900">Colony ID</div>
                      <div className="text-gray-600">{selectedColony.id}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Total Contacts</div>
                      <div className="text-gray-600">{selectedColony.contacts.length}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-gray-600">{selectedColony.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Region Detail View */}
        {currentView === 'region-detail' && selectedRegion && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('regions')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                ← Back to Regions
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Colonies in {selectedRegion}</h2>
              <p className="text-lg text-gray-600 mb-6">
                {colonies.filter(colony => colony.location === selectedRegion).length} colonies found
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colonies
                  .filter(colony => colony.location === selectedRegion)
                  .map((colony) => {
                    const { switchboard, manager } = getContactInfo(colony)
                    
                    return (
                      <div 
                        key={colony.id}
                        onClick={() => handleColonyClick(colony)}
                        className="bg-gray-50 rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{colony.name}</h3>
                        
                        <div className="space-y-2">
                          {switchboard && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{switchboard.phone || 'Available'}</span>
                            </div>
                          )}
                          
                          {manager && (
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              <span>{manager.name}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 text-sm text-blue-600 font-medium">
                          Click to view details →
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Colonies List (Hidden by default, shown when searching) */}
        {searchTerm && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Colonies</p>
                    <p className="text-2xl font-bold text-gray-900">{colonies.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Search className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">With Contact Info</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {colonies.filter(c => c.contacts.length > 0).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Info className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">93.5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonies List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Colonies ({filteredColonies.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredColonies.map((colony) => {
                  const { switchboard, manager, minister, postal } = getContactInfo(colony)
                  
                  return (
                    <Link
                      key={colony.id}
                      href={`/colony/${colony.id}`}
                      className="block p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {colony.name}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {colony.location}
                            </span>
                          </div>
                          
                          <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                            {switchboard && (
                              <div className="flex items-center space-x-1">
                                <Search className="h-4 w-4" />
                                <span>Switchboard: {switchboard.phone || 'Available'}</span>
                              </div>
                            )}
                            
                            {manager && (
                              <div className="flex items-center space-x-1">
                                <Info className="h-4 w-4" />
                                <span>Manager: {manager.name}</span>
                              </div>
                            )}
                            
                            {colony.coordinates && (
                              <div className="flex items-center space-x-1">
                                <Globe className="h-4 w-4" />
                                <span>{colony.coordinates}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {colony.contacts.length} contact{colony.contacts.length !== 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Click to view details
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {filteredColonies.length === 0 && !loading && (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No colonies found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Registration Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Register</h2>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Colony Affiliation
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select your colony</option>
                    {colonies.map((colony) => (
                      <option key={colony.id} value={colony.id}>
                        {colony.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}