export function getInitiales(nom: string): string {
  return nom
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getHue(nom: string): number {
  const sum = nom.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return sum % 360
}
