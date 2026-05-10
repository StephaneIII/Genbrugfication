class CarpoolingController {
  constructor() {
    this.apiBaseUrl = 'http://localhost:3001/api'
  }

  async fetchJson(endpoint) {
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`)
    }

    return response.json()
  }

  /**
   * Create a new route
   * @param {Object} routeData - Route creation data
   * @returns {Promise<Object>} API response
   */
  async createRoute(routeData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating route:', error)
      throw error
    }
  }

  /**
   * Get all routes
   * @returns {Promise<Array>} List of routes
   */
  async getAllRoutes() {
    try {
      return await this.fetchJson('/routes')
    } catch (error) {
      console.error('Error fetching routes:', error)
      throw error
    }
  }

  /**
   * Get all routes enriched with seats left, driver and station details.
   * @param {number} currentUserId
   * @returns {Promise<Array>}
   */
  async getRouteOverview(currentUserId) {
    try {
      const [routes, stops, users, recyclingStations] = await Promise.all([
        this.fetchJson('/routes'),
        this.fetchJson('/stops'),
        this.fetchJson('/users'),
        this.fetchJson('/recyclingstations'),
      ])

      const safeUserId = Number(currentUserId)
      const userById = new Map(users.map((user) => [Number(user.UID), user]))
      const stationById = new Map(
        recyclingStations.map((station) => [Number(station.RecyclingStationID), station]),
      )

      const stopsByRoute = stops.reduce((accumulator, stop) => {
        const routeId = Number(stop.routeId)
        if (!accumulator.has(routeId)) {
          accumulator.set(routeId, [])
        }
        accumulator.get(routeId).push(stop)
        return accumulator
      }, new Map())

      return routes.map((route) => {
        const routeId = Number(route.RouteID)
        const driverId = Number(route.UID)
        const routeStops = stopsByRoute.get(routeId) || []
        const activeStops = routeStops.filter((stop) => {
          const status = String(stop.Status || '').toLowerCase()
          return status !== 'cancelled' && status !== 'canceled'
        })

        const bookedSeats = activeStops.reduce((sum, stop) => {
          return sum + Number(stop.PassengerAmount || 0)
        }, 0)

        const totalSeats = Number(route.AvailableSeats || 0)
        const seatsLeft = Math.max(0, totalSeats - bookedSeats)

        const driver = userById.get(driverId)
        const station = stationById.get(Number(route.RecyclingStationID))

        const isDriver = safeUserId === driverId
        const isBookedByUser = activeStops.some((stop) => Number(stop.userId) === safeUserId)

        return {
          ...route,
          DriverUsername: driver?.Username || 'Unknown driver',
          StationAddress: station?.Address || 'Unknown address',
          StationPostNo: station?.PostNo ?? '-',
          BookedSeats: bookedSeats,
          SeatsLeft: seatsLeft,
          IsDriver: isDriver,
          IsBookedByUser: isBookedByUser,
        }
      })
    } catch (error) {
      console.error('Error fetching route overview:', error)
      throw error
    }
  }

  /**
   * Create a stop (book a seat) on a route.
   * @param {Object} stopData - { routeId, StopOrder, Address, userId, PassengerAmount, Weight }
   * @returns {Promise<Object>} Created stop from API
   */
  async createStop(stopData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stopData),
      })
      const data = await response.json()
      return { success: response.ok, data, error: response.ok ? null : data.error }
    } catch (error) {
      console.error('Error creating stop:', error)
      throw error
    }
  }

  /**
   * Get a single route by ID enriched with driver, station, stops and seats left.
   * @param {number} routeId
   * @param {number} currentUserId
   * @returns {Promise<Object>}
   */
  async getRouteDetail(routeId, currentUserId) {
    try {
      const [routes, stops, users, recyclingStations] = await Promise.all([
        this.fetchJson('/routes'),
        this.fetchJson('/stops'),
        this.fetchJson('/users'),
        this.fetchJson('/recyclingstations'),
      ])

      const route = routes.find((r) => Number(r.RouteID) === Number(routeId))
      if (!route) throw new Error('Route not found')

      const safeUserId = Number(currentUserId)
      const userById = new Map(users.map((u) => [Number(u.UID), u]))
      const stationById = new Map(recyclingStations.map((s) => [Number(s.RecyclingStationID), s]))

      const routeStops = stops.filter((s) => Number(s.routeId) === Number(routeId))
      const activeStops = routeStops.filter((s) => {
        const status = String(s.Status || '').toLowerCase()
        return status !== 'cancelled' && status !== 'canceled'
      })

      const bookedSeats = activeStops.reduce((sum, s) => sum + Number(s.PassengerAmount || 0), 0)
      const seatsLeft = Math.max(0, Number(route.AvailableSeats || 0) - bookedSeats)

      const driver = userById.get(Number(route.UID))
      const station = stationById.get(Number(route.RecyclingStationID))

      const stopsEnriched = routeStops.map((s) => ({
        ...s,
        Username: userById.get(Number(s.userId))?.Username || 'Unknown',
        Tlf: userById.get(Number(s.userId))?.Tlf || null,
      }))

      return {
        ...route,
        DriverUsername: driver?.Username || 'Unknown driver',
        DriverTlf: driver?.Tlf || null,
        StationName: station?.Name || '',
        StationAddress: station?.Address || 'Unknown address',
        StationPostNo: station?.PostNo ?? '-',
        BookedSeats: bookedSeats,
        SeatsLeft: seatsLeft,
        IsDriver: safeUserId === Number(route.UID),
        IsBookedByUser: activeStops.some((s) => Number(s.userId) === safeUserId),
        Stops: stopsEnriched,
        NextStopOrder: routeStops.length + 1,
      }
    } catch (error) {
      console.error('Error fetching route detail:', error)
      throw error
    }
  }
}

export default CarpoolingController
