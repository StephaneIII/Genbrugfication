<script>
import RecycleIconMetal from '../components/Images/RecycleIconMetal.jpg'
import RecycleIconPlastic from '../components/Images/RecycleIconPlastic.jpg'

export default {
    data() {
        return {
            metalIcon: RecycleIconMetal,
            plastIcon: RecycleIconPlastic
        }
    }
}

</script>

<head>
</head>

<template>
    <div>
        <P>Små valg. Stor forskel.</P>
        <input type="search" id="placeholder" name="q" aria-label="Søg efter info om skrald">
    </div>
    <div class="container">
        <div>
            <a href="placeholde">
                <img :src="metalIcon" alt="Profile" class="icon" />
            </a>
            <a href="placeholde">
                <img :src="plastIcon" alt="Sorter affald" class="icon" />
            </a>
        </div>
        <div>
            <a href="placeholde">
                <img :src="metalIcon" alt="Book car" class="icon" />
            </a>
            <a href="MapPage.vue">
                <img :src="plastIcon" alt="Kort" class="icon" />
            </a>
        </div>
    </div>
</template>