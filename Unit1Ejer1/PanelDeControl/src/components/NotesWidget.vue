<script setup lang="ts">
import { ref } from 'vue'

interface Note {
  text: string
  time: string
}

const notes = ref<Note[]>([])
const newNoteText = ref<string>('')

function addNote(): void {
  const trimmed = newNoteText.value.trim()
  if (!trimmed) return

  const now = new Date()
  notes.value.push({
    text: trimmed,
    time: now.toLocaleTimeString('es-ES'),
  })
  newNoteText.value = ''
}

function deleteNote(index: number): void {
  notes.value.splice(index, 1)
}
</script>

<template>
  <div class="widget notes-widget">
    <h2>Notas</h2>

    <div class="input-row">
      <input
        v-model="newNoteText"
        type="text"
        placeholder="Escribe una nota..."
        @keyup.enter="addNote"
      />
      <button @click="addNote">Añadir</button>
    </div>

    <ul class="notes-list">
      <li v-for="(note, index) in notes" :key="index" class="note-item">
        <div class="note-content">
          <span class="note-text">{{ note.text }}</span>
          <span class="note-time">{{ note.time }}</span>
        </div>
        <button class="delete-btn" @click="deleteNote(index)">✕</button>
      </li>
    </ul>

    <p class="counter">Total de notas: <strong>{{ notes.length }}</strong></p>
  </div>
</template>

<style scoped>
.widget {
  background: #1e1e2e;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  color: #cdd6f4;
}

h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #89b4fa;
}

.input-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #45475a;
  background: #313244;
  color: #cdd6f4;
  font-size: 0.95rem;
  outline: none;
}

input:focus {
  border-color: #89b4fa;
}

button {
  padding: 0.45rem 1rem;
  border-radius: 8px;
  border: none;
  background: #89b4fa;
  color: #1e1e2e;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.95rem;
}

button:hover {
  background: #b4befe;
}

.notes-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.note-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #313244;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
}

.note-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.note-text {
  font-size: 0.95rem;
}

.note-time {
  font-size: 0.75rem;
  color: #a6adc8;
}

.delete-btn {
  background: #f38ba8;
  color: #1e1e2e;
  padding: 0.25rem 0.55rem;
  font-size: 0.8rem;
  border-radius: 6px;
}

.delete-btn:hover {
  background: #eba0ac;
}

.counter {
  margin: 0;
  font-size: 0.9rem;
  color: #a6adc8;
  text-align: right;
}

.counter strong {
  color: #a6e3a1;
}
</style>
