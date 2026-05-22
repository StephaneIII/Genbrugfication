class PointController {
  constructor() {
    this.apiBaseUrl = 'http://localhost:3001/api'
  }

  async getTotalScoreByMonth(UID, month, year) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/checkout/score/month/${UID}?month=${month}&year=${year}`,
      )
      const data = await response.json()

      return {
        success: response.ok,
        data: { totalScore: data.totalScore ?? 0 },
        error: response.ok ? null : data.error || 'Kunne ikke hente månedsscore',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Kunne ikke oprette forbindelse til serveren',
      }
    }
  }

  async getTotalScoreByUID(UID) {
    try {
      let response = await fetch(`${this.apiBaseUrl}/checkout/score/user/${UID}`)

      // Fallback in case backend route is configured without /user.
      if (!response.ok) {
        response = await fetch(`${this.apiBaseUrl}/checkout/score/${UID}`)
      }

      const data = await response.json()

      return {
        success: response.ok,
        data: { totalScore: data.totalScore ?? 0 },
        error: response.ok ? null : data.error || 'Kunne ikke hente samlet score',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Kunne ikke oprette forbindelse til serveren',
      }
    }
  }
}

export default new PointController()
