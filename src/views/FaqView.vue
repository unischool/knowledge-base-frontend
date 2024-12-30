<template>
  <div class="construction-page">
    <h1>🚧 建構中...</h1>
    <p>此頁面正在開發中，敬請期待！</p>
    <div class="construction-icon">
      <span class="material-icons">construction</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FaqView'
}
</script>

<style scoped>
.construction-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #666;
}

p {
  font-size: 1.2rem;
  color: #888;
  margin-bottom: 2rem;
}

.construction-icon {
  font-size: 4rem;
  color: #ffd700;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
