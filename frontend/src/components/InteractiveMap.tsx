'use client'

import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPinIcon } from '@heroicons/react/24/outline'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Establishment {
  id: string
  name: string
  type: string
  description: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  certified_autism_friendly: boolean
  rating_average: number
  reviews_count: number
}

interface InteractiveMapProps {
  establishments: Establishment[]
  onMarkerClick: (establishmentId: string) => void
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons for different establishment types
const createCustomIcon = (type: string, certified: boolean) => {
  const colors = {
    hotel: '#E11D48', // Red
    restaurant: '#F59E0B', // Orange  
    attraction: '#10B981', // Green
    shop: '#8B5CF6', // Purple
    service: '#3B82F6', // Blue
    default: '#6B7280' // Gray
  }

  const color = colors[type as keyof typeof colors] || colors.default
  const certifiedBadge = certified ? '⭐' : ''

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <span style="color: white; font-size: 12px; font-weight: bold;">
          ${type === 'hotel' ? '🏨' : 
            type === 'restaurant' ? '🍽️' : 
            type === 'attraction' ? '🎯' : 
            type === 'shop' ? '🛍️' : 
            type === 'service' ? '🏢' : '📍'}
        </span>
        ${certified ? '<div style="position: absolute; top: -5px; right: -5px; background: gold; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px;">⭐</div>' : ''}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  })
}

export default function InteractiveMap({ establishments, onMarkerClick }: InteractiveMapProps) {
  const [mapReady, setMapReady] = useState(false)
  const [mapHeight, setMapHeight] = useState<'compact' | 'expanded'>('compact')

  // Algarve center coordinates
  const algarvCenter: [number, number] = [37.0194, -7.9322]

  useEffect(() => {
    setMapReady(true)
  }, [])

  const toggleMapHeight = () => {
    setMapHeight(prev => prev === 'compact' ? 'expanded' : 'compact')
  }

  if (!mapReady) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-secondary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  const heightClass = mapHeight === 'compact' ? 'h-96 lg:h-[500px]' : 'h-screen'

  return (
    <div className={`w-full ${heightClass} relative transition-all duration-300`}>
      <MapContainer
        center={algarvCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        {/* OpenStreetMap tiles - Free alternative to Google Maps */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Establishment markers */}
        {establishments.map((establishment) => (
          <Marker
            key={establishment.id}
            position={[
              establishment.coordinates.lat,
              establishment.coordinates.lng
            ]}
            icon={createCustomIcon(establishment.type, establishment.certified_autism_friendly)}
            eventHandlers={{
              click: () => onMarkerClick(establishment.id)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-secondary-800 mb-2">
                  {establishment.name}
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-secondary-600">
                    <span className="font-medium">Tipo:</span> {establishment.type}
                  </p>
                  {establishment.certified_autism_friendly && (
                    <div className="flex items-center text-autism-friendly font-medium">
                      <span className="mr-1">⭐</span>
                      Certificado Autism Friendly
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= establishment.rating_average
                              ? 'text-yellow-400'
                              : 'text-secondary-300'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-secondary-500">
                      ({establishment.reviews_count} avaliações)
                    </span>
                  </div>
                  <p className="text-secondary-700 text-xs mt-2">
                    {establishment.description.substring(0, 100)}...
                  </p>
                </div>
                <button
                  onClick={() => onMarkerClick(establishment.id)}
                  className="mt-3 w-full bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700 transition-colors"
                >
                  Ver Detalhes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Toggle Control */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg z-20">
        <button
          onClick={toggleMapHeight}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
          aria-label={mapHeight === 'compact' ? 'Expandir mapa' : 'Compactar mapa'}
        >
          {mapHeight === 'compact' ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Expandir Mapa</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6m12-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Compactar</span>
            </>
          )}
        </button>
      </div>

      {/* Map Legend - Compact Design */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-20 max-w-xs">
        <h4 className="font-bold text-secondary-800 mb-2 text-sm flex items-center">
          <MapPinIcon className="w-4 h-4 mr-1" />
          Estabelecimentos
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-base">🏨</span>
            <span>Hotéis</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-base">🍽️</span>
            <span>Restaurantes</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-base">🎯</span>
            <span>Atrações</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-base">🛍️</span>
            <span>Comércio</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-secondary-200">
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-yellow-500">⭐</span>
            <span className="text-autism-friendly font-medium">Certificado Autism Friendly</span>
          </div>
        </div>
      </div>

      {/* Quick Access Info */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-20 max-w-sm">
        <div className="text-center">
          <p className="text-xs text-secondary-600 mb-1">
            <span className="font-medium">{establishments.length} estabelecimentos</span> no mapa
          </p>
          <p className="text-xs text-secondary-500">
            Clique nos marcadores para ver detalhes
          </p>
        </div>
      </div>
    </div>
  )
}