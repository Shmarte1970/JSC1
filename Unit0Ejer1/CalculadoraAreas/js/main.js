// Con CDN no hay módulos, así que saco lo que necesito del objeto global Vue
const { createApp, ref, computed } = Vue;

createApp({
  setup() {

    const figuras = [
      { id: 'cuadrado',   label: 'Cuadrado'   },
      { id: 'rectangulo', label: 'Rectángulo'  },
      { id: 'circulo',    label: 'Círculo'     },
      { id: 'triangulo',  label: 'Triángulo'   },
    ];

    const figura  = ref('cuadrado');
    const lado    = ref(0);
    const base    = ref(0);
    const altura  = ref(0);
    const radio   = ref(0);

    // El área se recalcula sola cada vez que cambia la figura o cualquier input
    const area = computed(() => {
      switch (figura.value) {
        case 'cuadrado':   return lado.value * lado.value;
        case 'rectangulo': return base.value * altura.value;
        case 'circulo':    return Math.PI * radio.value * radio.value;
        case 'triangulo':  return (base.value * altura.value) / 2;
        default:           return 0;
      }
    });

    const formulaDetalle = computed(() => {
      switch (figura.value) {
        case 'cuadrado':
          return `Área = l² = ${lado.value} × ${lado.value}`;
        case 'rectangulo':
          return `Área = b × h = ${base.value} × ${altura.value}`;
        case 'circulo':
          return `Área = π × r² = π × ${radio.value}²`;
        case 'triangulo':
          return `Área = (b × h) / 2 = (${base.value} × ${altura.value}) / 2`;
        default:
          return '';
      }
    });

    return {
      figuras,
      figura,
      lado,
      base,
      altura,
      radio,
      area,
      formulaDetalle,
    };
  }
}).mount('#app');
