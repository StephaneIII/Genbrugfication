class TrashController {
  constructor() {
    this.apiBaseUrl = 'http://localhost:3001/api/trash'
    this.categoriesApiBaseUrl = 'http://localhost:3001/api/trashcategories'
  }

  /**
   * Get all trash types
   */
  async getAllTrash() {
    try {
      const response = await fetch(this.apiBaseUrl)
      const data = await response.json()

      return {
        success: response.ok,
        data,
        error: response.ok ? null : data.error,
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: 'Could not connect to server',
      }
    }
  }

  /**
   * Create new trash type
   */
  async createTrash(trashData) {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trashData),
      })

      const data = await response.json()

      return {
        success: response.ok,
        data,
        error: response.ok ? null : data.error,
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Could not connect to server',
      }
    }
  }

  /**
   * Get all trash categories
   */
  async getAllTrashCategories() {
    try {
      const response = await fetch(this.categoriesApiBaseUrl)
      const data = await response.json()

      return {
        success: response.ok,
        data,
        error: response.ok ? null : data.error,
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: 'Could not connect to server',
      }
    }
  }
  async deleteTrash(trashId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${trashId}`, {
        method: 'DELETE',
      })

      return {
        success: response.ok,
        error: response.ok ? null : 'Could not delete trash',
      }
    } catch (error) {
      return {
        success: false,
        error: 'Could not connect to server',
      }
    }
  }
}

export default new TrashController()
