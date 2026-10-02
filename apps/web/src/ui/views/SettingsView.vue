<script setup lang="ts">
import { LOCALES } from '../../application/locale'
import { usePreferencesStore } from '../../application/preferences-store'
import { MESSAGES, useT } from '../i18n'

const prefs = usePreferencesStore()
const t = useT()
</script>

<template>
  <section class="settings card" aria-labelledby="settings-title">
    <h2 id="settings-title" tabindex="-1">{{ t.settings.title }}</h2>

    <fieldset class="choices choices--2col">
      <legend>{{ t.settings.languageLegend }}</legend>
      <!-- Cada idioma se nombra en su propio idioma y lo declara (WCAG 3.1.2). -->
      <label v-for="l in LOCALES" :key="l" class="choice">
        <input
          type="radio"
          name="locale"
          class="choice__input"
          :value="l"
          :checked="prefs.locale === l"
          :data-testid="`locale-${l}`"
          @change="prefs.setLocale(l)"
        />
        <span class="choice__body">
          <span class="choice__title" :lang="l">{{ MESSAGES[l].meta.name }}</span>
        </span>
      </label>
    </fieldset>

    <fieldset class="choices">
      <legend>{{ t.settings.inputLegend }}</legend>
      <label class="choice">
        <input
          type="radio"
          name="input-mode"
          class="choice__input"
          value="keyboard"
          :checked="prefs.inputMode === 'keyboard'"
          data-testid="input-keyboard"
          @change="prefs.setInputMode('keyboard')"
        />
        <span class="choice__body">
          <span class="choice__title">{{ t.settings.inputKeyboard }}</span>
          <span class="choice__hint">{{ t.settings.inputKeyboardHint }}</span>
        </span>
      </label>
      <label class="choice">
        <input
          type="radio"
          name="input-mode"
          class="choice__input"
          value="stepper"
          :checked="prefs.inputMode === 'stepper'"
          data-testid="input-stepper"
          @change="prefs.setInputMode('stepper')"
        />
        <span class="choice__body">
          <span class="choice__title">{{ t.settings.inputStepper }}</span>
          <span class="choice__hint">{{ t.settings.inputStepperHint }}</span>
        </span>
      </label>
    </fieldset>

    <p class="muted settings__note">{{ t.settings.themeNote }}</p>
  </section>
</template>

<style scoped>
.settings {
  max-width: 32rem;
  margin: 0 auto;
  display: grid;
  gap: var(--space-5);
}

.settings h2 {
  font-size: var(--text-xl);
}

.settings__note {
  font-size: var(--text-sm);
}
</style>
