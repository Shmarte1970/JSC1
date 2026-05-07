// Con CDN no hay módulos, así que saco lo que necesito del objeto global Vue
const { createApp, ref, computed } = Vue;

createApp({
  setup() {

    const peliculas = ref([]);
    const soloEnCines = ref(false);

    // Cargo los datos desde el JSON externo para mantener los datos separados del código
    fetch('data/peliculas.json')
      .then(res => res.json())
      .then(data => peliculas.value = data);

    const peliculasFiltradas = computed(() =>
      soloEnCines.value ? peliculas.value.filter(p => p.enCines) : peliculas.value
    );

    function toggleFiltro() {
      soloEnCines.value = !soloEnCines.value;
    }

    return {
      peliculas,
      soloEnCines,
      peliculasFiltradas,
      toggleFiltro,
    };
  }
}).mount('#app');
