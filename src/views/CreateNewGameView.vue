<template>
    <header>
    
    </header>
    <main>
        <div>
            <h1>You are creating a new game!</h1>
        </div>
        <div class="select-Language">
            <p>
                <label for="lang">Language</label><br>

                <input type="radio" id="svenska" v-model="lang" value="Svenska">
                <label for="svenska">Svenska</label><br>

                <input type="radio" id="english" v-model="lang" value="English">
                <label for="english">English</label><br>
            </p>
        </div>
        <div class="select-DrawTime">
            <p>
                <label for="DrawTime">Draw Time</label><br>

                <input type="radio" id="30" v-model="DrawTime" value="Svenska">
                <label for="svenska">Svenska</label><br>

                <input type="radio" id="english" v-model="lang" value="English">
                <label for="english">English</label><br>
            </p>
        </div>
    </main>
</template>

<script>

</script>

<style scoped>
   h1 {
    font-size: 36pt;
   }
</style>