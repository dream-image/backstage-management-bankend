<template>
</template>
<script>
export default defineNuxtRouteMiddleware((to, from) => {
    return navigateTo('/login')
})
</script>