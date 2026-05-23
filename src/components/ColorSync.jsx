// src/components/ColorSync.jsx
import { useEffect } from 'react';

const ColorSync = ({ institucion }) => {
  useEffect(() => {
    if (institucion) {
      // Obtener colores de la API (están dentro de colorinstitucion[0])
      const colors = institucion.colorinstitucion?.[0] || {};
      
      const primaryColor = colors.color_primario || '#e68600';
      const secondaryColor = colors.color_secundario || '#a75c06';
      const tertiaryColor = colors.color_terciario || '#000000';
      
      // Aplicar variables CSS al root
      document.documentElement.style.setProperty('--color-primary', primaryColor);
      document.documentElement.style.setProperty('--color-secondary', secondaryColor);
      document.documentElement.style.setProperty('--color-tertiary', tertiaryColor);
      
      // Variantes para efectos
      document.documentElement.style.setProperty('--color-primary-light', `${primaryColor}cc`);
      document.documentElement.style.setProperty('--color-primary-dark', `${primaryColor}99`);
      document.documentElement.style.setProperty('--color-primary-glow', `${primaryColor}40`);
      
      console.log('🎨 Colores sincronizados desde API:', {
        primary: primaryColor,
        secondary: secondaryColor,
        tertiary: tertiaryColor
      });
    }
  }, [institucion]);

  return null;
};

export default ColorSync;