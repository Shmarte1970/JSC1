// Con CDN no hay módulos, así que saco lo que necesito del objeto global Vue
const { createApp, ref } = Vue;

createApp({
  setup() {

    const contactos = ref([]);
    const nuevoContacto = ref('');
    // Este flag solo se activa si el usuario intenta añadir con el campo vacío
    const mostrarError = ref(false);

    function añadirContacto() {
      const nombre = nuevoContacto.value.trim();

      if (!nombre) {
        mostrarError.value = true;
        return;
      }

      contactos.value.push(nombre);
      nuevoContacto.value = '';
      mostrarError.value = false;
    }

    function eliminarContacto(index) {
      contactos.value.splice(index, 1);
    }

    return {
      contactos,
      nuevoContacto,
      mostrarError,
      añadirContacto,
      eliminarContacto,
    };
  }
}).mount('#app');
