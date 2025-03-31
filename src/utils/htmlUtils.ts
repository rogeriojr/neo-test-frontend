/**
 * Utilitários para manipulação de HTML e texto
 */

/**
 * Decodifica entidades HTML em um texto
 * @param text Texto com entidades HTML
 * @returns Texto decodificado
 */
export const decodeHtmlEntities = (text: string): string => {
  if (!text) return '';

  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};