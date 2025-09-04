'use client'

import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Establishment {
  id: string
  name: string
  type: string
  description: string
  address: string
  coordinates: {
    latitude: number
    longitude: number
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

  // Algarve center coordinates
  const algarvCenter: [number, number] = [37.0194, -7.9322]

  useEffect(() => {
    setMapReady(true)
  }, [])

  if (!mapReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-secondary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative">
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
              establishment.coordinates.latitude,
              establishment.coordinates.longitude
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

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-20 max-w-xs">
        <h4 className="font-bold text-secondary-800 mb-2 text-sm">Legenda</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <span>🏨</span>
            <span>Hotéis</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🍽️</span>
            <span>Restaurantes</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🎯</span>
            <span>Atrações</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🛍️</span>
            <span>Comércio</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>⭐</span>
            <span className="text-autism-friendly font-medium">Certificado Autism Friendly</span>
          </div>
        </div>
      </div>

      {/* Map Controls Info */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
        <p className="text-xs text-secondary-600 text-center">
          <span className="font-medium">Clique nos marcadores</span><br />
          para ver detalhes
        </p>
      </div>
    </div>
  )
}