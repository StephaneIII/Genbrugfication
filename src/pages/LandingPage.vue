<script>
import RecycleIconMetal from './components/Images/Recycle_Icon_Metal.jpg'

export default {
    data() {
        return {
            metalIcon: RecycleIconMetal
        }
    }
}

</script>

<template>
    <div>
        <img :src="metalIcon" alt="recycle metal" class="icon" />
        <p>test test test</p>
    </div>
</template>