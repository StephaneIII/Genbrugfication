class CheckoutController {
  constructor() {
    this.apiBaseUrl = 'http://localhost:3001/api'
  }

  async getOrCreateOpenCheckout(userId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${userId}`)
      const data = await response.json()

      return {
        success: response.ok,
        data,
        error: response.ok ? null : data.error || 'Failed to load checkout',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Could not connect to server',
      }
    }
  }

  async addTrashToCheckout(userId, trashId, amount = 1) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${userId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TrashID: trashId, Amount: amount }),
      })
      const data = await response.json()

      return {
        success: response.ok,
        data,
        error: response.ok ? null : data.error || 'Failed to add trash',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Could not connect to server',
      }
    }
  }

  async updateTrashAmount(userId, trashId, amount) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${userId}/items/${trashId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Amount: amount }),
      })
      const data = await response.json()

      return {
        success: response.ok,
        data,
        error: response.ok ? null : data.error || 'Failed to update trash amount',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Could not connect to server',
      }
    }
  }

  async removeTrashFromCheckout(userId, trashId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${userId}/items/${trashId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      return {
        success: response.ok,
        data,
        error: response.ok ? null : data.error || 'Failed to remove trash',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Could not connect to server',
      }
    }
  }

  async lockOpenCheckout(userId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${userId}/lock`, {
        method: 'POST',
      })
      const data = await response.json()

      return {
        success: response.ok,
        data,
        error: response.ok ? null : data.error || 'Failed to lock checkout',
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: 'Could not connect to server',
      }
    }
  }
}

export default new CheckoutController()
