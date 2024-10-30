<template>
    <!-- main container -->
    <div>
        <!-- input section -->
        <div @click="focusInput">
            <div class="typing-prompt">Type the following prompt:</div>
            <div class="prompt-container">
                <div 
                    v-for="(letter, index) in typePrompt" 
                    :key="index"
                    :class="[index < typed.length ? (typePrompt[index] == typed[index] ? 'correct' : 'incorrect') : '']"
                    v-html="letter === ' ' ? '&nbsp;' : letter">
                </div>
            </div>
        </div>
        <!-- hidden input to listen capture user typing -->
        <input 
            type="text"
            v-model="typed"
            @keydown="handleKeyDown"
            @input="handleInput"
            style="opacity: 0; position: absolute; left: -9999px;"
            ref="typingInput"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const typePrompt = ref('Brawl Stars was originally designed in portrait mode during beta, but switched to landscape mode due to player feedback for better controls and gameplay. However, based on player feedback, Supercell switched the game to landscape mode, which allowed for better control over movement and aiming, improving the overall gameplay experience. This change was hugely popular and has stuck with the game ever since!');
const typed = ref('');
const typingInput = ref<HTMLInputElement | null>(null);


const handleKeyDown = (event) => {
    typingInput.value?.focus();
}

const handleInput = (event) => {
    console.log("User input:", typed);
}

const focusInput = () => {
    typingInput.value?.focus();
}

onMounted(() => {
    console.log("Mounted!!!")
    typingInput.value?.focus();
})
</script>

<style scoped>
.typing-prompt {
    color: white;
}
.prompt-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.correct {
    color: white;
}
.incorrect {
    color: rgb(167, 57, 57);
}
</style>