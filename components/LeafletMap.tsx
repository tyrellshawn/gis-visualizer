'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

interface Trail {
    FID: number
    AccessName: string
    Address: string
    BikeTrail: string
    FISHING: string
    ADAtrail: string
    Latitude: number
    Longitude: number
}

interface LeafletMapProps {
    trails: Trail[]
    isModalOpen: boolean
}

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: icon.src,
    iconRetinaUrl: icon.src,
    shadowUrl: iconShadow.src,
})

export default function LeafletMap({ trails, isModalOpen }: LeafletMapProps) {
    const mapRef = useRef<L.Map | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!mapRef.current) {
                mapRef.current = L.map('map').setView([40.0150, -105.2705], 11) // Boulder, CO coordinates
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mapRef.current)
            }

            // Clear existing markers
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapRef.current?.removeLayer(layer)
                }
            })

            // Add markers for filtered trails
            trails.forEach((trail) => {
                const marker = L.marker([trail.Latitude, trail.Longitude])
                    .addTo(mapRef.current!)
                    .bindPopup(`
                        <b>${trail.AccessName}</b><br>
                        ${trail.Address}<br>
                        Bike Trail: ${trail.BikeTrail}<br>
                        Fishing: ${trail.FISHING}<br>
                        Difficulty: ${trail.ADAtrail}
                    `)
            })

            // Adjust map view to fit all markers
            if (trails.length > 0) {
                const group = L.featureGroup(trails.map(trail => L.marker([trail.Latitude, trail.Longitude])))
                mapRef.current.fitBounds(group.getBounds().pad(0.1))
            }
        }
    }, [trails])

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.invalidateSize()
            if (isModalOpen) {
                mapRef.current.getContainer().style.filter = 'blur(4px)'
            } else {
                mapRef.current.getContainer().style.filter = 'none'
            }
        }
    }, [isModalOpen])

    return (
        <div
            id="map"
            className={`h-full w-full transition-all duration-300 ease-in-out ${isModalOpen ? 'pointer-events-none' : ''
                }`}
        />
    )
}