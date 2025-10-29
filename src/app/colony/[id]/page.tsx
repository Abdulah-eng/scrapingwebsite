'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Phone, MapPin, User, Mail, Building, School } from 'lucide-react'
import { supabase, ColonyWithContacts } from '@/lib/supabase'
import Link from 'next/link'

export default function ColonyPage() {
  const params = useParams()
  const [colony, setColony] = useState<ColonyWithContacts | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'contacts' | 'location'>('contacts')

  useEffect(() => {
    if (params.id) {
      fetchColony(params.id as string)
    }
  }, [params.id])

  const fetchColony = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('colonies')
        .select(`
          *,
          contacts (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setColony(data)
    } catch (error) {
      console.error('Error fetching colony:', error)
    } finally {
      setLoading(false)
    }
  }

  const getContactsByType = (type: string) => {
    return colony?.contacts.filter(c => c.contact_type === type) || []
  }

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return ''
    // Add clickable tel: link
    return phone
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!colony) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Colony not found</h2>
        <p className="mt-2 text-gray-600">The colony you're looking for doesn't exist.</p>
        <Link href="/" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to colonies
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to colonies
        </Link>
      </div>

      {/* Colony Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{colony.name}</h1>
            <p className="text-lg text-gray-600 mt-1">{colony.location}</p>
            {colony.coordinates && (
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {colony.coordinates}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Contact Information</div>
            <div className="text-lg font-semibold text-gray-900">
              {colony.contacts.length} contact{colony.contacts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'location'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Location
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              {/* Switchboard */}
              {getContactsByType('switchboard').map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Switchboard
                  </h3>
                  <div className="space-y-2">
                    {contact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-500">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    {contact.extensions && (
                      <div className="text-sm text-gray-600">
                        {contact.extensions}
                      </div>
                    )}
                    {contact.name && (
                      <div className="text-sm text-gray-600">
                        Contact: {contact.name}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Manager */}
              {getContactsByType('manager').map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Manager
                  </h3>
                  <div className="space-y-2">
                    {contact.name && (
                      <div className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-500">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    {contact.fax && (
                      <div className="text-sm text-gray-600">
                        Fax: {contact.fax}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Minister */}
              {getContactsByType('minister').map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Minister
                  </h3>
                  <div className="space-y-2">
                    {contact.name && (
                      <div className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-500">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Postal Address */}
              {getContactsByType('postal').map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Postal Address
                  </h3>
                  <div className="space-y-1">
                    {contact.street && (
                      <div className="text-sm text-gray-900">{contact.street}</div>
                    )}
                    {contact.city && (
                      <div className="text-sm text-gray-900">{contact.city}</div>
                    )}
                    {contact.zip_code && (
                      <div className="text-sm text-gray-900">{contact.zip_code}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* School */}
              {getContactsByType('school').map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <School className="h-5 w-5 mr-2" />
                    School
                  </h3>
                  <div className="space-y-2">
                    {contact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-500">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    {contact.fax && (
                      <div className="text-sm text-gray-600">
                        Fax: {contact.fax}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6">
              {colony.latitude && colony.longitude ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <div className="text-lg font-mono text-gray-900">
                        {colony.latitude}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <div className="text-lg font-mono text-gray-900">
                        {colony.longitude}
                      </div>
                    </div>
                  </div>
                  
                  {colony.coordinates && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coordinates
                      </label>
                      <div className="text-lg text-gray-900">
                        {colony.coordinates}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <a
                      href={`https://www.google.com/maps?q=${colony.latitude},${colony.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Google Maps
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No location data</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Location information is not available for this colony.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
