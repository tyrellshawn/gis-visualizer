'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, Bike, Fish, Mountain, CheckSquare, CheckCircle2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import trailsData from './rest_data.json'

const LeafletMap = dynamic(() => import('./LeafletMap'), {
    ssr: false,
    loading: () => <p>Loading map...</p>
})

// Sample subset of trail data
const sampleTrailData = trailsData

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

function ScheduleHikeModal({ trail, isOpen, onClose }: { trail: Trail | null, isOpen: boolean, onClose: () => void }) {
    const [isScheduled, setIsScheduled] = useState(false)

    const handleSchedule = () => {
        setIsScheduled(true)
        setTimeout(() => {
            onClose()
            setIsScheduled(false)
        }, 2000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] z-50">
                <DialogHeader>
                    <DialogTitle>Schedule a Hike</DialogTitle>
                    <DialogDescription>
                        {trail ? trail.AccessName : 'Select a trail'}
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <AnimatePresence mode="wait">
                        {isScheduled ? (
                            <motion.div
                                key="scheduled"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col items-center justify-center p-4"
                            >
                                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                <h2 className="text-xl font-semibold mb-2">Hike Scheduled!</h2>
                                <p className="text-center">Your hike to {trail?.AccessName} has been successfully scheduled.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="p-4"
                            >
                                <p className="mb-4">Are you sure you want to schedule a hike to {trail?.AccessName}?</p>
                                <div className="flex justify-end space-x-2">
                                    <Button onClick={onClose}>Cancel</Button>
                                    <Button type="submit" onClick={handleSchedule}>Schedule Hike</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function Component() {
    const [filters, setFilters] = useState({
        search: '',
        bikeTrail: false,
        fishing: false,
        difficulty: [] as string[]
    })
    const [filteredTrails, setFilteredTrails] = useState(sampleTrailData)
    const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const filtered = sampleTrailData.filter(trail => {
            return (
                trail.AccessName.toLowerCase().includes(filters.search.toLowerCase()) &&
                (filters.bikeTrail ? trail.BikeTrail === "Yes" : true) &&
                (filters.fishing ? trail.FISHING === "Yes" : true) &&
                (filters.difficulty.length === 0 || filters.difficulty.includes(trail.ADAtrail.toLowerCase()))
            )
        })
        setFilteredTrails(filtered)
    }, [filters])

    const toggleDifficulty = (difficulty: string) => {
        setFilters(prev => {
            const newDifficulties = prev.difficulty.includes(difficulty)
                ? prev.difficulty.filter(d => d !== difficulty)
                : [...prev.difficulty, difficulty]
            return { ...prev, difficulty: newDifficulties }
        })
    }

    const toggleAllDifficulties = () => {
        setFilters(prev => ({
            ...prev,
            difficulty: prev.difficulty.length === 3 ? [] : ['easy', 'moderate', 'difficult']
        }))
    }

    const toggleFilter = (filter: 'bikeTrail' | 'fishing') => {
        setFilters(prev => ({ ...prev, [filter]: !prev[filter] }))
    }

    const openModal = (trail: Trail) => {
        setSelectedTrail(trail)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedTrail(null)
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="w-full lg:w-1/3 p-4 bg-white overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Hiking Trail Finder</h1>
                <div className="relative mb-4">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search trails..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="pl-10"
                    />
                </div>
                <div className="mb-4 grid grid-cols-2 gap-2">
                    <Card
                        className={`cursor-pointer ${filters.bikeTrail ? 'bg-primary text-primary-foreground' : ''}`}
                        onClick={() => toggleFilter('bikeTrail')}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-2">
                            <Bike className="w-6 h-6 mb-1" />
                            <span className="text-sm">Bike Trail</span>
                        </CardContent>
                    </Card>
                    <Card
                        className={`cursor-pointer ${filters.fishing ? 'bg-primary text-primary-foreground' : ''}`}
                        onClick={() => toggleFilter('fishing')}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-2">
                            <Fish className="w-6 h-6 mb-1" />
                            <span className="text-sm">Fishing</span>
                        </CardContent>
                    </Card>
                </div>
                <div className="mb-4">
                    <Label className="flex items-center space-x-2 mb-2">
                        <Checkbox
                            checked={filters.difficulty.length === 3}
                            onCheckedChange={toggleAllDifficulties}
                        />
                        <CheckSquare className="w-4 h-4 mr-2" />
                        <span>Select All Difficulties</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { name: 'Easy', icons: 1 },
                            { name: 'Moderate', icons: 2 },
                            { name: 'Difficult', icons: 3 }
                        ].map(({ name, icons }) => (
                            <Card
                                key={name}
                                className={`cursor-pointer ${filters.difficulty.includes(name.toLowerCase()) ? 'bg-primary text-primary-foreground' : ''
                                    }`}
                                onClick={() => toggleDifficulty(name.toLowerCase())}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-2">
                                    <div className="flex mb-1">
                                        {[...Array(icons)].map((_, i) => (
                                            <Mountain key={i} className="w-4 h-4" />
                                        ))}
                                    </div>
                                    <span className="text-sm">{name}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Filtered Trails ({filteredTrails.length})</h2>
                    {filteredTrails.map((trail) => (
                        <Card key={trail.FID} className="mb-2">
                            <CardContent className="p-4">
                                <h3 className="font-medium">{trail.AccessName}</h3>
                                <p className="text-sm text-gray-600">{trail.Address}</p>
                                <p className="text-sm text-gray-600">
                                    Difficulty: {trail.ADAtrail}
                                    {' '}
                                    {[...Array(trail.ADAtrail === 'Easy' ? 1 : trail.ADAtrail ===
                                        'Moderate' ? 2 : 3)].map((_, i) => (
                                            <Mountain key={i} className="inline w-4 h-4" />
                                        ))}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {trail.BikeTrail === "Yes" && <Bike className="inline w-4 h-4 mr-1" />}
                                    {trail.FISHING === "Yes" && <Fish className="inline w-4 h-4 mr-1" />}
                                </p>
                                <div className="mt-2">
                                    <Button variant="outline" size="sm" onClick={() => openModal(trail)}>Schedule Hike</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="w-full lg:w-2/3 relative">
                <LeafletMap trails={filteredTrails} isModalOpen={isModalOpen} />
            </div>
            <ScheduleHikeModal
                trail={selectedTrail}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    )
}