<template>
  <div class="skeleton-card" aria-hidden="true">
    <div class="skeleton-top">
      <div class="skeleton-avatar shimmer"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line shimmer" style="width: 65%"></div>
        <div class="skeleton-line shimmer" style="width: 45%"></div>
      </div>
    </div>
    <div class="skeleton-chips">
      <span class="skeleton-chip shimmer"></span>
      <span class="skeleton-chip shimmer"></span>
      <span class="skeleton-chip shimmer"></span>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.skeleton-top {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.skeleton-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 0.7rem;
  border-radius: var(--radius-pill);
}

.skeleton-chips {
  display: flex;
  gap: 0.4rem;
}

.skeleton-chip {
  width: 3.5rem;
  height: 1.4rem;
  border-radius: var(--radius-pill);
}

.shimmer {
  background: linear-gradient(
    90deg,
    var(--color-surface-alt) 25%,
    color-mix(in srgb, var(--color-primary) 12%, var(--color-surface-alt)) 37%,
    var(--color-surface-alt) 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer {
    animation: none;
  }
}
</style>
