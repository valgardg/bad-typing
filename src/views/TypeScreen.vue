<template>
    <!-- main container -->
    <div>
        <!-- input section -->
        <div @click="focusInput">
            <div class="">Type the following prompt:</div>
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
        <!-- clock + stats div -->
        <div class="time-div">
            <p>{{ minutes }}m {{ seconds }}.{{ milliseconds }}s</p>
        </div>

        <div class="stats-div">
            <p class="wpm-text">wpm - {{ wpm }}</p>
            <p>accuracy - {{ accuracy }}%</p>
            <p>correct - {{ correct }} characters</p>
            <p>errors - {{ errors }} characters</p>
        </div>

        <div>
            <button @click="() => { mistakeMode = !mistakeMode }" style="opacity: 0; width: 10rem; height: 10rem;">Toggle Mistake Mode</button>
        </div>

        <!-- hidden input to listen capture user typing -->
        <input 
            type="text"
            v-model="typed"
            @keydown="handleKeyDown"
            @input="handleInput($event)"
            @focus="onFocus"
            @blur="onBlur"
            style="opacity: 0; position: absolute; left: -9999px;"
            ref="typingInput"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { paragraph } from 'txtgen';
import { getMistake } from '@/utils/mistake';
import confetti from 'canvas-confetti';


const mistakeMode = ref(false);
const canType = ref(true);
const typePrompt = ref('Hailey is end game. She will be happy with her Ally.');
const typed = ref('');
const typingInput = ref<HTMLInputElement | null>(null);

const handleKeyDown = () => {
    if(canType.value) {
        typingInput.value?.focus();
    }
}

const handleInput = (event: Event) => {
    if (!running.value) {
        startClock();
    }
    const inputEvent = event as InputEvent;
    const typedChar = (inputEvent.data || '').slice(-1);

    // handle prank logic
    if (mistakeMode.value && typed.value.length > 0 && typedChar.match(/[a-zA-Z]/) && Math.random() < 0.07) {
        var mistakeChar = getMistake(typedChar);
        typed.value = typed.value.slice(0, -1) + mistakeChar;
    }
    if(typed.value.length >= typePrompt.value.length) {
        stopClock();
        canType.value = false;
        calculateStats();
        typingInput.value?.blur();

        // confetti animation
        var duration = 15 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }
}

const focusInput = () => {
    if(!canType.value) {
        return;
    }
    typingInput.value?.focus();
}

onMounted(() => {
    console.log("Mounted!!!")
    typingInput.value?.focus();
    typePrompt.value = paragraph(3);
})

// focus and blur event handling for hidden input element
const isFocused = ref(false);
const onFocus = () => {
    isFocused.value = true;
}
const onBlur = () => {
    isFocused.value = false;
}

// clock implementation
const running = ref(false);
const startTime = ref(0);
const elapsedTime = ref(0);
let interval: number | null = null;

const minutes = computed(() => Math.floor(elapsedTime.value / 60000));
const seconds = computed(() => Math.floor((elapsedTime.value % 60000) / 1000));
const milliseconds = computed(() => elapsedTime.value % 1000);

const startClock = () => {
    if (!running.value) {
        running.value = true;
        startTime.value = Date.now() - elapsedTime.value;
        interval = setInterval(() => {
            elapsedTime.value = Date.now() - startTime.value;
        }, 10);
    }
}

const stopClock = () => {
    if(interval) {
        running.value = false;
        clearInterval(interval);
    }
}

// stats
const errors = ref(0);
const correct = ref(0);
const accuracy = ref(0);
const wpm = ref(0);

const calculateStats = () => {
    let total = 0;
    let correctly_typed = 0;

    for(let i = 0; i < typePrompt.value.length; i++) {
        if (typed.value[i] == typePrompt.value[i]) {
            correctly_typed += 1;
        }
        total += 1;
    }
    correct.value = correctly_typed;
    errors.value = total - correctly_typed;
    accuracy.value = Math.round(((correctly_typed / total) * 100) * 100) / 100;
    wpm.value = Math.round(((correctly_typed / 5) / (minutes.value + (seconds.value / 60))) * 100) / 100;
}
</script>

<style scoped>
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
/* clock and stats styles */
.time-div {
    display: flex;
    align-items: center;
    justify-content: center;
}
.stats-div {
    font-size: large;
}
.wpm-text {
    font-size: x-large;
    font-weight: bold;
}
</style>