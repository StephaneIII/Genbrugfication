<script>
import Stylesheet from '../styles/reset.css'
import profilePageIcon from '../components/Images/ProfileIcon.jpg'
import recyclePageIcon from '../components/Images/TrashCanlcon.jpg'
import mapPageIcon from '../components/Images/MapIcon.jpg'
import RecycleIconMetal from '../components/Images/RecycleIconMetal.jpg'

export default {
    data() {
        return {
            profileIcon: profilePageIcon,
            recycleIcon: recyclePageIcon,
            mapIcon: mapPageIcon,
            placeholder: RecycleIconMetal,
        }
    }
}

</script>

<head>
</head>

<template>
    <v-main class="landing-page">
    <div>
        <P>Små valg. Stor forskel.</P>
        <input type="search" id="placeholder" name="q" aria-label="Søg efter info om skrald">
    </div>
    <div class="container">
        <div>
            <a href="Cart.vue">
                <img :src="profileIcon" alt="Profile" class="icon" />
            </a>
            <a href="Cart.vue">
                <img :src="recycleIcon" alt="Sorter affald" class="icon" />
            </a>
        </div>
        <div>
            <a href="MapPage.vue">
                <img :src="mapIcon" alt="Kort" class="icon" />
            </a>
            <a href="RoutePage.vue">
                <img :src="placeholder" alt="Book car" class="icon" />
            </a>
        </div>
    </div>
    </v-main>
</template>

<style scoped>
.icon {
    height: 80px;
    width: 80px;
}
.container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 20px;
}
</style>