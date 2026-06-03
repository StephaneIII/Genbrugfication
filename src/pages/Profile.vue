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

        if (!session || !session.UID) {
          this.errorMessage = 'Brugersession ikke fundet. Prøv at login igen.'
          this.redirectToLogin()
          return
        }

        // Fetch full user data from API
        const result = await UserController.getUserById(session.UID)

        if (result.success) {
          this.user = result.data
          this.editableUser = { ...result.data }
        } else {
          this.errorMessage = result.error || 'Profile fejlet med at loade'
        }
      } catch (error) {
        console.error('Profile loading error:', error)
        this.errorMessage = 'Kunne ikke oprette forbindelse til server. Prøve igen.'
      } finally {
        this.isLoading = false
      }
    },

    handleLogout() {
      // Clear user session
      UserController.clearUserSession()

      this.successMessage = 'Du har logged ud! Redirecting...'

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
        // Get user session to get UID
        const session = UserController.getUserSession()
        if (!session || !session.UID) {
          this.errorMessage = 'Sessionen er udløbet. Log venligst ind igen.'
          this.redirectToLogin()
          return
        }

        // Call API to update user data
        const result = await UserController.updateUser(session.UID, this.editableUser)

        if (result.success) {
          this.user = { ...this.editableUser }
          this.isEditing = false
          this.hasChanges = false
          this.successMessage = 'Profile er opdateret!'
        } else {
          this.errorMessage = result.error
        }
      } catch (error) {
        console.error('Update error:', error)
        this.errorMessage = 'Fejlet med at opdatere profile. Prøv venligst igen.'
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
        this.deleteError = 'Dit password skal bruges til at slette din profile.'
        return
      }

      this.isLoading = true
      this.deleteError = ''

      try {
        // Get user session to get UID
        const session = UserController.getUserSession()
        if (!session || !session.UID) {
          this.deleteError = 'Sessionen er udløbet. Log venligst ind igen .'
          return
        }

        // First verify the password
        const passwordResult = await UserController.verifyPassword(
          session.UID,
          this.deletePassword,
        )

        if (!passwordResult.success) {
          this.deleteError = passwordResult.error || 'Invalid password'
          return
        }

        // If password is correct, proceed with account deletion
        const deleteResult = await UserController.deleteUser(session.UID)

        if (deleteResult.success) {
          UserController.clearUserSession()
          this.showDeleteModal = false
          this.successMessage = 'Profilen er slettet. Redirecting...'

          setTimeout(() => {
            this.$router.push('/')
          }, 2000)
        } else {
          this.deleteError = deleteResult.error || 'Fejlet med at slette profilen.'
        }
      } catch (error) {
        console.error('Delete error:', error)
        this.deleteError = 'Fejlet med at slette profilen. Prøv venligst igen.'
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
          <h1 class="profile-title">Din Profil</h1>
          <p class="profile-subtitle">Profil information</p>
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
                <label>Brugernavn</label>
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
                <label>Fornavn</label>
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
                <label>Efternavn</label>
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
              <label>Email Adresse</label>
              <div class="info-value sealed-value">{{ user.Email }}</div>
            </div>

            <div class="info-group">
              <label>Telefon Nummer</label>
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
              <label>Venne-kode</label>
              <div class="info-value friend-code">{{ user.FriendCode }}</div>
            </div>
          </div>

          <div class="profile-actions">
            <div v-if="isEditing" class="edit-actions">
              <button @click="saveChanges" :disabled="isLoading" class="save-button">
                <span v-if="isLoading" class="loading-spinner">⟳</span>
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </button>
              <button @click="cancelEditing" class="cancel-button">Afbryd</button>
            </div>
            <div v-else class="default-actions">
              <button @click="handleDeleteAccount" :disabled="isLoading" class="delete-button">
                Slet profile
              </button>
              <button @click="handleLogout" class="logout-button">Log ud</button>
              <button @click="handleReturn" class="return-button">Tilbage</button>
            </div>
          </div>
        </div>

        <!-- Login Link (if no user data) -->
        <footer v-if="!user && !isLoading" class="login-link">
          <p>
            brug for at logge ind?
            <router-link to="/login" class="link">Login here</router-link>
          </p>
        </footer>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Slet Profil</h3>
          <button @click="cancelDelete" class="modal-close">×</button>
        </div>

        <div class="modal-body">
          <p class="warning-text">
            ⚠️ Denne handling kan ikke fortrydes. Din profile og alt din data vil blive permanent slettet.
          </p>

          <div class="password-group">
            <label for="delete-password">Skriv dit password for at godkende:</label>
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
          <button @click="cancelDelete" class="modal-cancel-btn">Fortryd</button>
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
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--gap-large) var(--gap-med);
  font-family: var(--font-body);
  color: var(--color-text);
  box-sizing: border-box;
}

.profile-container {
  width: 100%;
  max-width: 760px;
}

.profile-card {
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  box-shadow: var(--shadow-card);
}

.header {
  text-align: center;
  margin-bottom: var(--gap-large);
}

.profile-title {
  margin: 0 0 var(--gap-small);
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
}

.profile-subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  line-height: 1.5;
}

.loading-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  box-shadow: var(--shadow);
  color: var(--color-text-muted);
  text-align: center;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  font-size: 2rem;
  margin-bottom: var(--gap-med);
  color: var(--color-primary);
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
  gap: var(--gap-small);
  padding: var(--gap-med);
  border-radius: var(--border-radius-med);
  margin-bottom: var(--gap-med);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
}

.error-alert {
  background: #fff5f5;
  color: #9f1c2e;
  border: 1px solid #f5c2c7;
}

.success-alert {
  background: #edf7f1;
  color: var(--color-primary);
  border: 1px solid var(--color-secondary);
}

.error-icon,
.success-icon {
  font-weight: var(--font-weight-bold);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--gap-large);
}

.profile-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-med);
}

.info-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-med);
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.info-group label {
  color: var(--color-text);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.input-container {
  position: relative;
  width: 100%;
}

.info-value,
.edit-input {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.75rem 3rem 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  line-height: 1.4;
  box-sizing: border-box;
}

.info-value {
  display: flex;
  align-items: center;
}

.edit-input {
  outline: none;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.edit-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.18);
}

.edit-input::placeholder {
  color: var(--color-text-muted);
}

.edit-btn {
  position: absolute;
  right: var(--gap-small);
  top: 50%;
  transform: translateY(-50%);
  min-width: 34px;
  min-height: 34px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  box-shadow: var(--shadow);
  transition:
    background var(--transition-fast),
    transform var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.edit-btn:hover {
  background: var(--color-accent);
  border-color: transparent;
  transform: translateY(-50%) scale(1.03);
  box-shadow: var(--shadow-card);
}

.edit-btn:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.profile-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--gap-med);
}

.default-actions,
.edit-actions {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-small);
}

.save-button,
.cancel-button,
.delete-button,
.return-button,
.logout-button,
.modal-cancel-btn,
.modal-delete-btn {
  min-height: 44px;
  border-radius: var(--border-radius-med);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    border-color var(--transition-fast);
}

.save-button,
.return-button {
  border: 1px solid transparent;
  background: var(--color-accent);
  color: var(--color-text);
  box-shadow: var(--shadow);
}

.save-button:hover:not(:disabled),
.return-button:hover {
  background: var(--color-primary);
  color: var(--color-text-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.cancel-button,
.logout-button {
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
}

.cancel-button:hover,
.logout-button:hover {
  background: var(--color-primary);
  color: var(--color-text-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.delete-button {
  border: 1px solid #9f1c2e;
  background: #fff5f5;
  color: #9f1c2e;
}

.delete-button:hover:not(:disabled) {
  background: #9f1c2e;
  color: var(--color-text-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.save-button:disabled,
.delete-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-link {
  text-align: center;
  margin-top: var(--gap-large);
  padding-top: var(--gap-large);
  border-top: 1px solid var(--color-border);
}

.login-link p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  line-height: 1.5;
}

.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
}

.link:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.link:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: var(--border-radius-small);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(31, 42, 36, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gap-med);
  backdrop-filter: blur(4px);
}

.modal-content {
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-med);
  padding: var(--gap-large);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
}

.modal-close {
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-round);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
}

.modal-close:hover {
  background: var(--color-primary);
  color: var(--color-text-light);
  transform: scale(1.03);
}

.modal-body {
  padding: var(--gap-large);
}

.warning-text {
  margin: 0 0 var(--gap-large);
  padding: var(--gap-med);
  background: #fff5f5;
  color: #9f1c2e;
  border: 1px solid #f5c2c7;
  border-radius: var(--border-radius-med);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  line-height: 1.5;
}

.password-group {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.password-group label {
  color: var(--color-text);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.password-input {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  outline: none;
  box-sizing: border-box;
}

.password-input:focus {
  border-color: #9f1c2e;
  box-shadow: 0 0 0 3px rgba(159, 28, 46, 0.14);
}

.delete-error {
  color: #9f1c2e;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-small);
  padding: var(--gap-large);
  border-top: 1px solid var(--color-border);
}

.modal-cancel-btn {
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
}

.modal-cancel-btn:hover {
  background: var(--color-primary);
  color: var(--color-text-light);
}

.modal-delete-btn {
  border: 1px solid #9f1c2e;
  background: #9f1c2e;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-small);
}

.modal-delete-btn:hover:not(:disabled) {
  background: #7f1625;
  border-color: #7f1625;
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.modal-delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Tablet */
@media (min-width: 768px) {
  .profile-page {
    padding: var(--gap-xl) var(--gap-large);
  }

  .profile-card {
    padding: var(--gap-xl);
  }

  .info-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .default-actions {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .edit-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .modal-actions {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .profile-container {
    max-width: 820px;
  }

  .profile-card {
    padding: var(--gap-xl);
  }
}

/* Small mobile */
@media (max-width: 430px) {
  .profile-page {
    padding: var(--gap-med);
  }

  .profile-card {
    padding: var(--gap-large);
  }

  .profile-title {
    font-size: var(--font-size-h2);
  }

  .info-value,
  .edit-input {
    font-size: var(--font-size-small);
  }

  .modal-header,
  .modal-body,
  .modal-actions {
    padding: var(--gap-med);
  }
}
</style>