import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Board } from '../model/board.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SennseDataRequestService {
  configData: any;

  private sennseUrl = environment.sennseUrl;
  private username = environment.username;
  private password = environment.password;

  constructor(private http: HttpClient) { }

  async loadConfig(fileConfigurator: string): Promise<void> {
    try {
      this.configData = await this.http
        .get(fileConfigurator)
        .toPromise();
      console.log('Configuration loaded: ', this.configData);
    } catch (error) {
      console.log('Error loading config:', error);
    }
  }

  async login(): Promise<string | null> {
    const url = `${this.sennseUrl}/api/auth/login`;
    const body = {
      username: this.username,
      password: this.password,
    };
    try {
      const response: any = await this.http.post(url, body).toPromise();
      return response.token;
    } catch (error) {
      console.log('Login error:', error);
      return null;
    }
  }

  async buildTelemetry(token: string): Promise<any> {
    try {
      var resultFetchData: any = {};

      for (const device of this.configData.deviceIds) {
        const deviceId = device.nodeId;

        for (const sensor of device.sensors) {
          for (const key of Object.keys(sensor)) {
            let startTs: number;
            let endTs: number;
            let keys: string[] = [];
            let units: string[] = [];
            let labels: { [key: string]: string } = {};

            const sensorValue = sensor[key];

            if (sensorValue.includes('_&_') && sensorValue.includes('Logger_')) {
              // Case 1: Multiple values with Logger_
              const parts = sensorValue.split('_&_').map((part: string) => {
                const cleaned = part.replace('Logger_', '');
                return {
                  key: cleaned,
                  unit:
                    cleaned.includes('TempC') || cleaned.includes('Temperature')
                      ? '°C'
                      : cleaned.includes('Humidity')
                        ? '%'
                        : '',
                };
              });

              keys = parts.map((p: any) => p.key);
              units = parts.map((p: any) => p.unit);
              parts.forEach((part: any) => {
                const formattedLabel = part.key.replace(/([A-Q])/g, ' $1').trim();
                labels[part.key] = formattedLabel;
              });

              endTs = 1738159200000;
              startTs = endTs - 5 * 60 * 60 * 1000;
            }
            else if (sensorValue.includes('LightIntensity')) {
              // Case 2: LightIntensity
              const cleanedKey = sensorValue.replace('Logger_', '');
              keys = [cleanedKey];
              units = ['lx'];
              labels[cleanedKey] = key;
              endTs = 1732540140000;
              startTs = 1731930900000;
            }
            else if (sensorValue.includes('Logger_')) {
              // Case 3: Single Logger_ value
              const cleanedKey = sensorValue.replace('Logger_', '');
              keys = [cleanedKey];
              units = [
                cleanedKey.includes('TempC') || cleanedKey.includes('Temperature')
                  ? '°C'
                  : cleanedKey.includes('Humidity')
                    ? '%'
                    : '',
              ];
              labels[cleanedKey] = key;
              endTs = 1738159200000;
              startTs = endTs - 5 * 60 * 60 * 1000;
            }
            else if (sensorValue.includes('_&_') && !sensorValue.includes('Logger_')) {
              // Case 4: Multiple values without Logger_
              const parts = sensorValue.split('_&_');
              parts.forEach((item: any) => {
                const unit =
                  item.includes('TempC') || item.includes('Temperature')
                    ? '°C'
                    : item.includes('Humidity')
                      ? '%'
                      : '';
                keys.push(item);
                units.push(unit);
                const formattedLabel = item.replace(/([A-Q])/g, ' $1').trim();
                labels[item] = formattedLabel;
              });
              endTs = Date.now();
              startTs = endTs - 5 * 60 * 60 * 1000;
            }
            else {
              // Case 5: Default
              const now = Date.now();
              const cleanedKey = sensorValue.replace('Logger_', '');
              keys = [cleanedKey];
              units = [
                sensorValue.includes('TempC') || sensorValue.includes('Temperature')
                  ? '°C'
                  : sensorValue.includes('Humidity')
                    ? '%'
                    : '',
              ];
              labels[cleanedKey] = key;
              startTs = sensorValue.includes('Logger_')
                ? 1731502800000
                : now - 5 * 60 * 60 * 1000;
              endTs = now;
            }

            // ✅ Ensure your telemetry fetch is awaited if it returns a Promise
            const partialResult = await this.fetchTelemetryData(
              token,
              deviceId,
              keys,
              startTs,
              endTs,
              labels,
              units,
              ""
            );

            // Merge results instead of overwriting
            resultFetchData = {
              ...resultFetchData,
              ...partialResult
            };

            console.log("✅ Telemetry fetched for:", { deviceId, keys, startTs, endTs, labels, units });
            console.log("📦 Result 1:", partialResult);

          };
        }
      }
      console.log("📦 Result 2:", resultFetchData);
      return resultFetchData
    } catch (error) {
      console.error('❌ Build TelemetryData error: ', error);
    }
  }

  async fetchTelemetryData(
    token: string,
    deviceId: string,
    keys: string[] | string,
    startTs: number,
    endTs: number,
    labels: { [key: string]: string },
    units: string[] | string,
    nodeName: string
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': `Bearer ${token}`,
    };

    const keyList = Array.isArray(keys) ? keys.join(',') : keys;
    const fetchUrl = `${this.sennseUrl}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${keyList}&startTs=${startTs}&endTs=${endTs}&limit=90000`;

    try {
      const response: any = await this.http.get(fetchUrl, { headers }).toPromise();

      console.log(fetchUrl);
      console.log("Check the response result: ", response);
      
      const results: any = {};

      const processKey = (key: string, unit: string) => {
        const rawData = response[key];
        if (!rawData || !Array.isArray(rawData)) return [];

        const allData = rawData.map((entry: any) => ({
          timestamp: entry.ts,
          value: parseFloat(entry.value).toFixed(2),
          unit: unit,
          lable: labels[key] || key,
          nodeName: nodeName,
        }));

        // Reduce to hourly values
        const hourlyData = [];
        const hourMillis = 60 * 60 * 1000;
        for (let i = startTs; i < endTs; i += hourMillis) {
          const closest = allData.reduce((a, b) =>
            Math.abs(a.timestamp - i) < Math.abs(b.timestamp - i) ? a : b
          );
          hourlyData.push({ ...closest, timestamp: i });
        }

        return hourlyData;
      };

      if (Array.isArray(keys)) {
        keys.forEach((key, i) => {
          const unit = Array.isArray(units) ? units[i] : '';
          results[key] = processKey(key, unit);
        });
      } else {
        const unit = typeof units === 'string' ? units : '';
        results[keys] = processKey(keys, unit);
      }

      console.log("Fetch Telemetry Data function result: ", results);
      

      return results;
    } catch (error) {
      console.error("❌ Error fetching telemetry:", error);
      return {};
    }
  }


  async buildTelemetryBetaVersion(token: string, boardName: string, deviceId: string, sensorKey: string, sensorValue: string): Promise<any> {
    try {
      let keys: string[] = [];
      let units: string[] = [];
      let labels: { [key: string]: string } = {};
      let startTs: number;
      let endTs: number;

      if (sensorValue.includes('_&_') && sensorValue.includes('Logger_')) {
        const parts = sensorValue.split('_&_').map((part: string) => {
          const cleaned = part.replace('Logger_', '');
          return {
            key: cleaned,
            unit:
              cleaned.includes('TempC') || cleaned.includes('Temperature') || cleaned.includes('Temp')
                ? '°C'
                : cleaned.includes('Humidity')
                  ? '%'
                  : '',
          };
        });

        keys = parts.map((p) => p.key);
        units = parts.map((p) => p.unit);
        parts.forEach((p) => {
          labels[p.key] = p.key.replace(/([A-Q])/g, ' $1').trim();
        });

        endTs = 1738159200000;
        startTs = endTs - 5 * 60 * 60 * 1000;
      } else if (sensorValue.includes('LightIntensity')) {
        const cleanedKey = sensorValue.replace('Logger_', '');
        keys = [cleanedKey];
        units = ['lx'];
        labels[cleanedKey] = sensorKey;
        endTs = 1732540140000;
        startTs = 1731930900000;
      } else if (sensorValue.includes('Logger_')) {
        const cleanedKey = sensorValue.replace('Logger_', '');
        keys = [cleanedKey];
        units = [
          cleanedKey.includes('TempC') || cleanedKey.includes('Temperature') || cleanedKey.includes('Temp')
            ? '°C'
            : cleanedKey.includes('Humidity')
              ? '%'
              : '',
        ];
        labels[cleanedKey] = sensorKey;
        endTs = 1738159200000;
        startTs = endTs - 5 * 60 * 60 * 1000;
      } else if (sensorValue.includes('_&_')) {
        const parts = sensorValue.split('_&_');
        parts.forEach((item) => {
          const unit =
            item.includes('TempC') || item.includes('Temperature') || item.includes('Temp')
              ? '°C'
              : item.includes('Humidity')
                ? '%'
                : '';
          keys.push(item);
          units.push(unit);
          labels[item] = item.replace(/([A-Q])/g, ' $1').trim();
        });
        endTs = Date.now();
        startTs = endTs - 5 * 60 * 60 * 1000;
      } else {
        const now = Date.now();
        const cleanedKey = sensorValue.replace('Logger_', '');
        keys = [cleanedKey];
        units = [
          sensorValue.includes('TempC') || sensorValue.includes('Temperature')
            ? '°C'
            : sensorValue.includes('Humidity')
              ? '%'
              : '',
        ];
        labels[cleanedKey] = sensorKey;
        startTs = sensorValue.includes('Logger_')
          ? 1731502800000
          : now - 5 * 60 * 60 * 1000;
        endTs = now;
      }

      const result = await this.fetchTelemetryData(
        token,
        deviceId,
        keys,
        startTs,
        endTs,
        labels,
        units,
        boardName
      );

      console.log("✅ Fetched telemetry for:", { deviceId, keys, startTs, endTs, labels, units });
      return result;
    } catch (error) {
      console.error('❌ buildTelemetry error: ', error);
      return null;
    }
  }


}
