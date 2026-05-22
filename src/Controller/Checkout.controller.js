class CheckoutController {
  constructor() {
    this.apiBaseUrl = 'http://localhost:3001/api'
  }

  async getOrCreateOpenCheckout(UID) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${UID}`)
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

  async addTrashToCheckout(UID, trashId, amount = 1) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${UID}/items`, {
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

  async updateTrashAmount(UID, trashId, amount) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${UID}/items/${trashId}`, {
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

  async removeTrashFromCheckout(UID, trashId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${UID}/items/${trashId}`, {
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

  async lockOpenCheckout(UID) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/checkout/open/${UID}/lock`, {
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
