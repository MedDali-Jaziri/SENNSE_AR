import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class WidgetGernatorService {

  constructor() { }

  createDynamicWidget(telemetryMap: string, sensorData: any[]): HTMLElement {
    console.log("Create Dynamic Widget !!");
    console.log(sensorData);
    console.log("📦 Result: ", sensorData[0]?.unit);
    console.log(telemetryMap);

    // console.log(sensorData.value);

    // Create the widget container
    const widget = document.createElement("div");
    widget.id = "widget"; // Add an ID
    widget.style.cssText = "background: linear-gradient(145deg, #2e3b4e, #1c2533); border-radius: 20px; width: 380px; padding: 25px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), inset 0 -1px 10px rgba(255, 255, 255, 0.1); position: relative; overflow: hidden;";
    widget.style.position = "absolute";
    widget.style.top = "-9999px";

    const gradientOverlay = document.createElement("div");
    gradientOverlay.style.cssText = "position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(255, 82, 82, 0.15), rgba(255, 152, 0, 0.15)); z-index: 0; pointer-events: none;";

    const widgetContent = document.createElement("div");
    widgetContent.style.cssText = "position: relative; z-index: 1;";


    const title = document.createElement("h2");
    title.id = "temperatureTitle";
    title.textContent = "";
    title.style.cssText = "font-size: 1.6rem; margin: 0; color: #e0e5ec; text-transform: uppercase; text-align: center; letter-spacing: 1px; margin-bottom: 10px;";


    const sensorName = document.createElement("div");
    sensorName.innerHTML = `Last 5 Hours SENNSE <br>${telemetryMap}`;
    // sensorName.textContent = `Last 5 Hours <br> SENNSE`;

    sensorName.style.cssText = "font-size: 0.95rem; color: #aab4be; margin-bottom: 15px; text-align: center;";

    const temperature = document.createElement("div");
    temperature.style.cssText = "font-size: 4.5rem; color: #ff6e6e; text-align: center; font-weight: bold; margin-bottom: 20px; position: relative; display: flex; justify-content: center; align-items: center;";

    const arrow = document.createElement("span");
    arrow.textContent = "\u2191";
    arrow.style.cssText = "display: inline-block; color: #ff6e6e; font-size: 2.8rem; vertical-align: middle; margin-right: 10px;";

    const temperatureValue = document.createElement("span");
    temperatureValue.id = "temperature-value";
    temperatureValue.textContent = "";
    temperatureValue.style.cssText = "font-size: 2.5rem;";

    const degreeSymbol = document.createElement("span");
    degreeSymbol.textContent = "";
    degreeSymbol.style.cssText = "font-size: 1.8rem;";

    temperature.appendChild(arrow);
    temperature.appendChild(temperatureValue);
    temperature.appendChild(degreeSymbol);


    const chartContainer = document.createElement("div");
    chartContainer.style.cssText = "border-top: 2px solid rgba(255, 255, 255, 0.2); padding-top: 15px; margin-top: 15px;";

    const canvas = document.createElement("canvas");
    canvas.id = "chart";
    canvas.style.cssText = "width: 100%; height: 150px;";
    chartContainer.appendChild(canvas);

    const timestamp = document.createElement("div");
    timestamp.id = "timestamp";
    timestamp.textContent = `Last updated: ${new Date().toLocaleString()}`;
    timestamp.style.cssText = "font-size: 0.9rem; color: #90a4ae; text-align: center; margin-top: 15px; font-style: italic;";


    widgetContent.appendChild(title);
    widgetContent.appendChild(sensorName);
    widgetContent.appendChild(temperature);
    widgetContent.appendChild(chartContainer);
    widgetContent.appendChild(timestamp);


    widget.appendChild(gradientOverlay);
    widget.appendChild(widgetContent);

    console.log("Sucess !!");

    return widget;
  }

  drawTemp_HumSensorChart(dataPoints: any[], canvas: HTMLCanvasElement, widgetElement: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Update UI elements (if they exist)
        const timestampElement = widgetElement.querySelector("#timestamp"); // Add this line
        const tempValueElement = widgetElement.querySelector("#temperature-value");
        const temperatureTitleElement = widgetElement.querySelector("#temperatureTitle");
        const ctx = canvas.getContext("2d")!;
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        const numHorizontalLines = 5;
        const numVerticalLines = 10;

        // Get all keys from the dataPoints object
        const sensorKeys = Object.keys(dataPoints);

        // Validate if there are sensors available
        if (sensorKeys.length === 0) {
          console.error("No sensor data found!");
          resolve(); // Resolve to avoid blocking the application
          return;
        }

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Create gradient background
        gradient.addColorStop(0, "rgba(255, 105, 180, 0.4)");
        gradient.addColorStop(1, "rgba(75, 192, 192, 0.1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Grid Lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= numHorizontalLines; i++) {
          const y = (canvas.height / numHorizontalLines) * i;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        for (let i = 0; i <= numVerticalLines; i++) {
          const x = (canvas.width / numVerticalLines) * i;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        // Iterate over all sensor keys and process each sensor's data
        sensorKeys.forEach((sensorKey: any) => {
          const sensorData = dataPoints[sensorKey];

          const latestValue = sensorData[sensorData.length - 1].value;

          if (temperatureTitleElement) {
            if (tempValueElement) {
              let values = tempValueElement.textContent!.split(" / ").filter(v => v); // Split by " / " and remove empty values

              if (values.length >= 2) {
                values.shift(); // Remove the oldest value, keeping only one
              }

              values.push(`${latestValue}${sensorData[0].unit}`); // Add the new value
              tempValueElement.textContent = values.join(" | "); // Join without "/"
            }
            temperatureTitleElement.textContent = sensorData[0].nodeName;
          }


          // Validate if sensorData is an array and contains data
          if (!Array.isArray(sensorData) || sensorData.length === 0) {
            console.error(`Data for sensor ${sensorKey} is empty or not an array!`);
            return; // Skip to next sensor
          }

          // Log the data points for debugging
          console.log(`Temperature and Humidity Data for ${sensorKey}:`, sensorData);

          // Separate temperature and humidity data
          let temperatureData = sensorData.filter(dp =>
            (dp.unit?.includes("°C") || dp.label?.includes("Temp"))
          );

          let humidityData = sensorData.filter(dp =>
            (dp.unit?.includes("%") || dp.label?.includes("Humidity"))
          );
          // Log the separated data
          console.log(`Temperature Data for ${sensorKey}:`, temperatureData);
          console.log(`Humidity Data for ${sensorKey}:`, humidityData);

          // Get min/max values for proper scaling (considering data for each sensor separately)
          const tempMin = Math.min(...temperatureData.map(dp => dp.value), 18);
          const tempMax = Math.max(...temperatureData.map(dp => dp.value), 25);

          const humMin = 0;
          const humMax = 100;

          // Function to scale Y-coordinates
          const scaleY = (value: any, min: any, max: any) =>
            canvas.height - ((value - min) / (max - min)) * canvas.height;

          // Function to draw a line graph
          const drawGraph = (data: any, color: any, min: any, max: any) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();

            data.forEach((point: any, index: any) => {
              const x = (canvas.width / (data.length - 1)) * index;
              const y = scaleY(point.value, min, max);
              if (index === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            });

            ctx.stroke();
          };

          // Draw Temperature Line
          if (temperatureData.length > 0) {
            drawGraph(temperatureData, "#ffd700", tempMin, tempMax);
          }

          // Draw Humidity Line
          if (humidityData.length > 0) {
            drawGraph(humidityData, "#4d94ff", humMin, humMax);
          }

          // Draw Data Points
          const drawPoints = (data: any, color: any, min: any, max: any) => {
            data.forEach((point: any, index: any) => {
              const x = (canvas.width / (data.length - 1)) * index;
              const y = scaleY(point.value, min, max);

              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
              ctx.strokeStyle = "#fff";
              ctx.lineWidth = 2;
              ctx.stroke();

              ctx.font = "12px Arial";
              ctx.fillStyle = "#fff";
              ctx.textAlign = "center";
              ctx.fillText(`${point.value}${point.unit}`, x, y - 10);
              ctx.fillText(
                new Date(point.timestamp).toLocaleTimeString(),
                x,
                canvas.height - 10
              );
            });
          };

          // Draw Temperature Points
          if (temperatureData.length > 0) {
            drawPoints(temperatureData, "#ff6e6e", tempMin, tempMax);
          }

          // Draw Humidity Points
          if (humidityData.length > 0) {
            drawPoints(humidityData, "#4d94ff", humMin, humMax);
          }
        });

        resolve();

      } catch (error) {
        console.error("Error drawing temperature/humidity chart:", error);
        reject(error);
      }
    });
  }

  async drawLumxSensorChart(dataPoints: any[], widgetElement: HTMLElement): Promise<void> {
    if (!Array.isArray(dataPoints) || dataPoints.length === 0) {
      console.error("No data points available to draw the chart.");
      return;
    }

    const latestValue = dataPoints[dataPoints.length - 1].y;
    const tempValueElement = widgetElement.querySelector("#temperature-value");
    const timestampElement = widgetElement.querySelector("#timestamp");
    const temperatureTitleElement = widgetElement.querySelector("#temperatureTitle");
    const canvas = widgetElement.querySelector("#chart") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);

    if (tempValueElement) tempValueElement.textContent = latestValue;
    if (timestampElement) timestampElement.textContent = `Last updated: ${new Date().toLocaleString()}`;
    if (temperatureTitleElement) temperatureTitleElement.textContent = dataPoints[0].label;

    gradient.addColorStop(0, "rgba(255, 165, 0, 0.4)");
    gradient.addColorStop(1, "rgba(75, 192, 192, 0.1)");

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataPoints.map(point => new Date(point.x)),
        datasets: [{
          label: 'Illuminance (lx)',
          data: dataPoints.map(point => ({ x: point.x, y: point.y })),
          borderColor: '#ff9800',
          backgroundColor: gradient,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour'
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Illuminance (lx)'
            }
          }
        }
      }
    });
  }

}
