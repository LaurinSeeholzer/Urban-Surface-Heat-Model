// Trigonometrische Funktionen für Grad statt Bogenmaß
function sin(alpha) {
    return Math.sin(alpha * (Math.PI / 180));
}
  
function cos(alpha) {
    return Math.cos(alpha * (Math.PI / 180));
}
  
function tan(alpha) {
    return Math.tan(alpha * (Math.PI / 180));
}
  
function asin(value) {
    return Math.asin(value) * (180 / Math.PI);
}
  
function acos(value) {
    return Math.acos(value) * (180 / Math.PI);
}
  
function atan(value) {
    return Math.atan(value) * (180 / Math.PI);
}

// Julianische Tageszahl berechnen für Sonnenstandberechungen
Date.prototype.getJulian = function() {
    // Datum und Uhrzeit extrahieren
    const year = this.getFullYear();
    const month = this.getMonth() + 1; // Monate sind nullbasiert
    const day = this.getDate();
    const hours = this.getHours();
    const minutes = this.getMinutes();
    const seconds = this.getSeconds();
  
    // Konvertierung zu Julianischem Datum
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const julianDate =
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045 +
      (hours - 12) / 24 +
      minutes / 1440 +
      seconds / 86400;
  
    return julianDate;
};