// Normaliza texto para búsquedas: minúsculas y sin acentos/diacríticos
export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
}
