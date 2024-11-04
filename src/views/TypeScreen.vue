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
                    class="border-control"
                    :class="{
                        'correct': typed[index] === letter,
                        'incorrect': typed[index] !== letter && typed[index] !== undefined,
                        'cursor': index === typed.length && isFocused
                        }"
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
            @focus="onFocus"
            @blur="onBlur"
            style="opacity: 0; position: absolute; left: -9999px;"
            ref="typingInput"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const typePrompt = ref('Brawl Stars was originally designed in portrait mode during beta, but switched to landscape mode due to player feedback for better controls and gameplay. However, based on lots of player feedback, Supercell switched the game to landscape mode, which allowed for better control over movement and aiming, improving the overall gameplay experience. This change was hugely popular and has stuck with the game ever since!');
const typed = ref('');
const typingInput = ref<HTMLInputElement | null>(null);

const handleKeyDown = () => {
    typingInput.value?.focus();
}

const handleInput = () => {
    console.log("User input:", typed.value);
}

const focusInput = () => {
    typingInput.value?.focus();
}

onMounted(() => {
    console.log("Mounted!!!")
    typingInput.value?.focus();
})

// focus and blur event handling for hidden input element
const isFocused = ref(false);
const onFocus = () => {
    isFocused.value = true;
}
const onBlur = () => {
    isFocused.value = false;
}
</script>

<style scoped>
.typing-prompt {
    color: white;
}
.prompt-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    /* text styling */
    font-size: x-large;
}
.correct {
    color: white;
}
.incorrect {
    color: rgb(167, 57, 57);
}
.cursor {
  position: relative;
  display: inline-block; /* Ensures the pseudo-element is positioned relative to the text */
}
.cursor::before {
  content: ''; /* Required for the pseudo-element to display */
  position: absolute;
  top: 15%;
  width: 2px; /* Border thickness */
  height: 70%; /* Adjust the height of the border here */
  background-color: white;
  animation: blink 1s steps(2, start) infinite;
}
@keyframes blink {
    to {
        visibility: hidden;
    }
}
</style>