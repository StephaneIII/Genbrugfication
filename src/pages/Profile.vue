<script>
import UserController from '@/Controller/User.controller.js'

export default {
  name: 'Profile',
  data() {
    return {
      user: null,
      editableUser: null,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      isEditing: false,
      hasChanges: false,
      showDeleteModal: false,
      deletePassword: '',
      deleteError: '',
    }
  },
  async mounted() {
    // Check if user is logged in
    if (!UserController.isLoggedIn()) {
      this.$router.push('/login')
      return
    }

    await this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        // Get user session from localStorage
        const session = UserController.getUserSession()

        if (!session || !session.userId) {
          this.errorMessage = 'User session not found. Please login again.'
          this.redirectToLogin()
          return
        }

        // Fetch full user data from API
        const result = await UserController.getUserById(session.userId)

        if (result.success) {
          this.user = result.data
          this.editableUser = { ...result.data }
        } else {
          this.errorMessage = result.error || 'Failed to load user profile'
        }
      } catch (error) {
        console.error('Profile loading error:', error)
        this.errorMessage = 'Unable to connect to server. Please try again.'
      } finally {
        this.isLoading = false
      }
    },

    handleLogout() {
      // Clear user session
      UserController.clearUserSession()

      this.successMessage = 'Logged out successfully! Redirecting...'

      // Redirect to home page
      setTimeout(() => {
        this.$router.push('/')
      }, 1500)
    },

    redirectToLogin() {
      setTimeout(() => {
        this.$router.push('/login')
      }, 2000)
    },

    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
    },

    startEditing() {
      this.isEditing = true
      this.clearMessages()
    },

    cancelEditing() {
      // Always return to not editing mode and reset any changes
      this.editableUser = { ...this.user }
      this.hasChanges = false
      this.isEditing = false
      this.clearMessages()
    },

    async saveChanges() {
      this.isLoading = true
      this.clearMessages()

      try {
        // Get user session to get userId
        const session = UserController.getUserSession()
        if (!session || !session.userId) {
          this.errorMessage = 'Session expired. Please login again.'
          this.redirectToLogin()
          return
        }

        // Call API to update user data
        const result = await UserController.updateUser(session.userId, this.editableUser)

        if (result.success) {
          this.user = { ...this.editableUser }
          this.isEditing = false
          this.hasChanges = false
          this.successMessage = 'Profile updated successfully!'
        } else {
          this.errorMessage = result.error
        }
      } catch (error) {
        console.error('Update error:', error)
        this.errorMessage = 'Failed to update profile. Please try again.'
      } finally {
        this.isLoading = false
      }
    },

    onFieldChange() {
      this.hasChanges = true
    },

    handleReturn() {
      // Return to landing page
      this.$router.push('/')
    },

    handleDeleteAccount() {
      // Show password confirmation modal
      this.showDeleteModal = true
      this.deletePassword = ''
      this.deleteError = ''
      this.clearMessages()
    },

    cancelDelete() {
      this.showDeleteModal = false
      this.deletePassword = ''
      this.deleteError = ''
    },

    async confirmDelete() {
      if (!this.deletePassword) {
        this.deleteError = 'Password is required to delete your account'
        return
      }

      this.isLoading = true
      this.deleteError = ''

      try {
        // Get user session to get userId
        const session = UserController.getUserSession()
        if (!session || !session.userId) {
          this.deleteError = 'Session expired. Please login again.'
          return
        }

        // First verify the password
        const passwordResult = await UserController.verifyPassword(
          session.userId,
          this.deletePassword,
        )

        if (!passwordResult.success) {
          this.deleteError = passwordResult.error || 'Invalid password'
          return
        }

        // If password is correct, proceed with account deletion
        const deleteResult = await UserController.deleteUser(session.userId)

        if (deleteResult.success) {
          UserController.clearUserSession()
          this.showDeleteModal = false
          this.successMessage = 'Account deleted successfully. Redirecting...'

          setTimeout(() => {
            this.$router.push('/')
          }, 2000)
        } else {
          this.deleteError = deleteResult.error || 'Failed to delete account'
        }
      } catch (error) {
        console.error('Delete error:', error)
        this.deleteError = 'Failed to delete account. Please try again.'
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<template>
  <main class="profile-page">
    <div class="profile-container">
      <div class="profile-card">
        <header class="header">
          <h1 class="profile-title">My Profile</h1>
          <p class="profile-subtitle">Your account information</p>
        </header>

        <!-- Loading Display -->
        <section v-if="isLoading" class="loading-section">
          <div class="loading-spinner">⟳</div>
          <p>Loading profile...</p>
        </section>

        <!-- Error Display -->
        <section v-if="errorMessage" class="error-alert" role="alert" aria-live="polite">
          <i class="error-icon">⚠</i>
          {{ errorMessage }}
        </section>

        <!-- Success Display -->
        <section v-if="successMessage" class="success-alert" role="status" aria-live="polite">
          <i class="success-icon">✓</i>
          {{ successMessage }}
        </section>

        <!-- Profile Information -->
        <div v-if="user && !isLoading" class="profile-content">
          <div class="profile-info">
            <div class="info-row">
              <div class="info-group">
                <label>Username</label>
                <div class="input-container">
                  <input
                    v-if="isEditing"
                    v-model="editableUser.Username"
                    @input="onFieldChange"
                    type="text"
                    class="edit-input"
                    placeholder="Enter username"
                  />
                  <div v-else class="info-value">{{ user.Username }}</div>
                  <button
                    v-if="!isEditing"
                    @click="startEditing"
                    class="edit-btn"
                    title="Edit username"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </div>

            <div class="info-row">
              <div class="info-group">
                <label>First Name</label>
                <div class="input-container">
                  <input
                    v-if="isEditing"
                    v-model="editableUser.Firstname"
                    @input="onFieldChange"
                    type="text"
                    class="edit-input"
                    placeholder="Enter first name"
                  />
                  <div v-else class="info-value">{{ user.Firstname }}</div>
                  <button
                    v-if="!isEditing"
                    @click="startEditing"
                    class="edit-btn"
                    title="Edit first name"
                  >
                    ✏️
                  </button>
                </div>
              </div>

              <div class="info-group">
                <label>Last Name</label>
                <div class="input-container">
                  <input
                    v-if="isEditing"
                    v-model="editableUser.Lastname"
                    @input="onFieldChange"
                    type="text"
                    class="edit-input"
                    placeholder="Enter last name"
                  />
                  <div v-else class="info-value">{{ user.Lastname }}</div>
                  <button
                    v-if="!isEditing"
                    @click="startEditing"
                    class="edit-btn"
                    title="Edit last name"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </div>

            <div class="info-group">
              <label>Email Address (Login Credential)</label>
              <div class="info-value sealed-value">{{ user.Email }}</div>
            </div>

            <div class="info-group">
              <label>Phone Number</label>
              <div class="input-container">
                <input
                  v-if="isEditing"
                  v-model="editableUser.Tlf"
                  @input="onFieldChange"
                  type="tel"
                  class="edit-input"
                  placeholder="Enter phone number"
                />
                <div v-else class="info-value">{{ user.Tlf }}</div>
                <button
                  v-if="!isEditing"
                  @click="startEditing"
                  class="edit-btn"
                  title="Edit phone number"
                >
                  ✏️
                </button>
              </div>
            </div>

            <div class="info-group" v-if="user.FriendCode">
              <label>Friend Code</label>
              <div class="info-value friend-code">{{ user.FriendCode }}</div>
            </div>
          </div>

          <div class="profile-actions">
            <div v-if="isEditing" class="edit-actions">
              <button @click="saveChanges" :disabled="isLoading" class="save-button">
                <span v-if="isLoading" class="loading-spinner">⟳</span>
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </button>
              <button @click="cancelEditing" class="cancel-button">Cancel</button>
            </div>
            <div v-else class="default-actions">
              <button @click="handleDeleteAccount" :disabled="isLoading" class="delete-button">
                Delete Account
              </button>
              <button @click="handleReturn" class="return-button">Return</button>
              <button @click="handleLogout" class="logout-button">Log Out</button>
            </div>
          </div>
        </div>

        <!-- Login Link (if no user data) -->
        <footer v-if="!user && !isLoading" class="login-link">
          <p>
            Need to sign in?
            <router-link to="/login" class="link">Login here</router-link>
          </p>
        </footer>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Delete Account</h3>
          <button @click="cancelDelete" class="modal-close">×</button>
        </div>

        <div class="modal-body">
          <p class="warning-text">
            ⚠️ This action cannot be undone. Your account and all data will be permanently deleted.
          </p>

          <div class="password-group">
            <label for="delete-password">Enter your password to confirm:</label>
            <input
              id="delete-password"
              v-model="deletePassword"
              type="password"
              placeholder="Your password"
              class="password-input"
              @keyup.enter="confirmDelete"
            />
            <span v-if="deleteError" class="delete-error">{{ deleteError }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="cancelDelete" class="modal-cancel-btn">Cancel</button>
          <button
            @click="confirmDelete"
            :disabled="isLoading || !deletePassword"
            class="modal-delete-btn"
          >
            <span v-if="isLoading" class="loading-spinner">⟳</span>
            {{ isLoading ? 'Deleting...' : 'Delete Account' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  padding: 20px;
  font-family: var(--font-body);
}

.profile-container {
  width: 100%;
  max-width: 650px;
}

.profile-card {
  background: #f8f9fab9;
  border-radius: var(--border-radius-large);
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.profile-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-heading);
  margin-bottom: 8px;
}

.profile-subtitle {
  color: #718096;
  font-size: 1rem;
}

.loading-section {
  text-align: center;
  padding: 32px 16px;
  color: #718096;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  font-size: 2rem;
  margin-bottom: 16px;
  color: var(--secondary-color);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-alert,
.success-alert {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: var(--border-radius-med);
  margin-bottom: 20px;
  font-weight: 500;
}

.error-alert {
  background-color: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

.success-alert {
  background-color: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.error-icon,
.success-icon {
  margin-right: 8px;
  font-weight: bold;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--gap-large);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: var(--gap-large);
}

.info-row {
  display: flex;
  gap: var(--gap-med);
}

.info-row .info-group {
  flex: 1;
}

.info-group {
  display: flex;
  flex-direction: column;
}

.info-group label {
  font-weight: 600;
  color: var(--dark-text);
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.info-value {
  padding: 12px 50px 12px 16px;
  background-color: var(--white-text);
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  color: var(--dark-text);
  min-height: 20px;
  position: relative;
  display: flex;
  align-items: center;
}

.friend-code {
  font-weight: 600;
  color: var(--secondary-color);
  background-color: #f0f9ff;
  border-color: #bae6fd;
}

.sealed-value {
  font-weight: 600;
  color: var(--secondary-color);
  background-color: #f0f9ff;
  border-color: #bae6fd;
  padding: 12px 16px;
}

.input-container {
  position: relative;
  display: block;
  width: 100%;
}

.edit-btn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  padding: 4px 6px;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: all 0.2s ease;
  border-radius: var(--border-radius-small);
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.edit-btn:hover {
  opacity: 1;
  background-color: rgba(47, 107, 95, 0.1);
  border-color: var(--secondary-color);
  transform: translateY(-50%) scale(1.05);
}

.edit-input {
  padding: 12px 50px 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: var(--white-text);
  color: var(--dark-text);
  width: 100%;
  min-height: 20px;
}

.edit-input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.1);
}

.edit-actions {
  display: flex;
  gap: var(--gap-med);
  justify-content: center;
  width: 100%;
}

.save-button {
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  color: var(--white-text);
  border: none;
  padding: 14px 24px;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-heading);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-small);
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(47, 107, 95, 0.3);
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.cancel-button {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: var(--white-text);
  border: none;
  padding: 14px 24px;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-heading);
}

.cancel-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(107, 114, 128, 0.3);
}

.profile-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--gap-med);
}

.logout-button {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: var(--white-text);
  border: none;
  padding: 14px 24px;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-heading);
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.3);
}

.default-actions {
  display: flex;
  gap: var(--gap-med);
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
}

.delete-button {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: var(--white-text);
  border: none;
  padding: 12px 20px;
  border-radius: var(--border-radius-med);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-heading);
}

.delete-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.3);
}

.delete-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.return-button {
  background: linear-gradient(135deg, var(--secondary-color) 0%, #1e4a42 100%);
  color: var(--white-text);
  border: none;
  padding: 12px 20px;
  border-radius: var(--border-radius-med);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-heading);
}

.return-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(47, 107, 95, 0.3);
}

.login-link {
  text-align: center;
  margin-top: var(--gap-large);
  padding-top: var(--gap-large);
  border-top: 1px solid #e2e8f0;
}

.login-link p {
  color: #718096;
  margin: 0;
}

.link {
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--white-text);
  border-radius: var(--border-radius-large);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-heading);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 4px;
  border-radius: var(--border-radius-small);
  transition: all 0.2s ease;
}

.modal-close:hover {
  color: var(--dark-text);
  background-color: #f7fafc;
}

.modal-body {
  padding: 24px;
}

.warning-text {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: var(--border-radius-med);
  border: 1px solid #fecaca;
  margin-bottom: 20px;
  font-weight: 500;
  font-size: 0.9rem;
}

.password-group {
  display: flex;
  flex-direction: column;
}

.password-group label {
  font-weight: 600;
  color: var(--dark-text);
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.password-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius-med);
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: var(--white-text);
  color: var(--dark-text);
}

.password-input:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.delete-error {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 6px;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: var(--gap-med);
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  justify-content: flex-end;
}

.modal-cancel-btn {
  background: #f8f9fa;
  color: var(--dark-text);
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: var(--border-radius-med);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-heading);
}

.modal-cancel-btn:hover {
  background: #e9ecef;
  border-color: #d1d5db;
}

.modal-delete-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: var(--white-text);
  border: none;
  padding: 10px 20px;
  border-radius: var(--border-radius-med);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-heading);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-small);
  min-width: 120px;
}

.modal-delete-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(220, 38, 38, 0.4);
}

.modal-delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 10px;
  }

  .profile-card {
    padding: 24px;
  }

  .info-row {
    flex-direction: column;
    gap: var(--gap-large);
  }

  .profile-title {
    font-size: 1.5rem;
  }

  .default-actions {
    flex-direction: column;
    gap: var(--gap-small);
  }

  .edit-actions {
    flex-direction: column;
    gap: var(--gap-small);
  }

  .delete-button,
  .return-button,
  .logout-button,
  .save-button,
  .cancel-button {
    width: 100%;
    padding: 12px 16px;
  }

  .modal-content {
    width: 95%;
    max-width: none;
    margin: 10px;
  }

  .modal-header,
  .modal-body,
  .modal-actions {
    padding: 16px;
  }

  .modal-actions {
    flex-direction: column;
    gap: var(--gap-small);
  }

  .modal-cancel-btn,
  .modal-delete-btn {
    width: 100%;
    padding: 12px 16px;
  }
}
</style>
