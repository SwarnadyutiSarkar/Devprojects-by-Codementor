import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  temperature: number;
  unit: string = 'celsius';
  result: string;

  convert() {
    if (isNaN(this.temperature)) {
      this.result = 'Please enter a valid number';
      return;
    }

    let convertedTemperature: number;
    let resultUnit: string;

    switch (this.unit) {
      case 'celsius':
        convertedTemperature = (this.temperature * 9 / 5) + 32;
        resultUnit = 'Fahrenheit';
        break;
      case 'fahrenheit':
        convertedTemperature = (this.temperature - 32) * 5 / 9;
        resultUnit = 'Celsius';
        break;
      case 'kelvin':
        convertedTemperature = this.temperature - 273.15;
        resultUnit = 'Celsius';
        break;
      default:
        this.result = 'Please select a valid unit';
        return;
    }

    this.result = `Converted Temperature: ${convertedTemperature.toFixed(2)} ${resultUnit}`;
  }
}
