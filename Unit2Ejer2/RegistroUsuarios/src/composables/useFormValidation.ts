import { ref, computed } from 'vue';

export function useFormValidation() {
  const name = ref('');
  const email = ref('');
  const password = ref('');

  const nameError = computed(() => {
    if (name.value.length === 0) return '';
    return name.value.length < 2 ? 'El nombre debe tener al menos 2 caracteres.' : '';
  });

  const emailError = computed(() => {
    if (email.value.length === 0) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(email.value) ? 'Introduce un correo electrónico válido.' : '';
  });

  const passwordError = computed(() => {
    if (password.value.length === 0) return '';
    return password.value.length < 8 ? 'La contraseña debe tener al menos 8 caracteres.' : '';
  });

  const passwordStrength = computed(() => {
    if (password.value.length === 0) return '';
    return password.value.length >= 8 ? 'Fuerte' : 'Débil';
  });

  const errors = computed(() =>
    [nameError.value, emailError.value, passwordError.value].filter(Boolean)
  );

  const isValid = computed(() =>
    name.value.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    password.value.length >= 8
  );

  function reset() {
    name.value = '';
    email.value = '';
    password.value = '';
  }

  return { name, email, password, nameError, emailError, passwordError, passwordStrength, errors, isValid, reset };
}
