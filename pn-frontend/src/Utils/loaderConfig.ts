import { NgxUiLoaderConfig } from "ngx-ui-loader";

export const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    fgsColor: "#007bff", // Color del spinner
    fgsType: "ball-spin", // Tipo de spinner (simple y profesional)
    fgsSize: 50, // Tamaño del spinner
    overlayColor: "rgba(0, 0, 0, 0.3)", // Color del overlay con opacidad
    pbColor: "#007bff", // Color de la barra de progreso
    pbThickness: 4, // Grosor de la barra de progreso
    hasProgressBar: true, // Muestra barra de progreso
    minTime: 300, // Tiempo mínimo en ms para mostrar el loader
    maxTime: -1, // Sin tiempo máximo
    text: "Cargando...", // Texto opcional debajo del spinner
    textColor: "#FFFFFF", // Color del texto
    textPosition: "center-center", // Posición del texto
  };