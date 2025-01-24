import * as fs from 'node:fs';
import path from 'node:path';
import { InjectableError } from './errors';
import { ServiceData, ServiceName } from './types';

export class Container {
  private static readonly services: Map<ServiceName, unknown> = new Map();

  public static async init(): Promise<void> {
    try {
      const servicesData: ServiceData[] = JSON.parse(fs.readFileSync('./dependencies/services.json', 'utf-8'));
      for (const serviceData of servicesData) {
        const modulePath = path.resolve(serviceData.path);
        const importedModule = await import(modulePath);

        if (importedModule[serviceData.name]) {
          const serviceInstance = new importedModule[serviceData.name]();
          this.services.set(serviceData.name, serviceInstance);
        }
      }
    } catch (error) {
      throw new InjectableError('Failed to initialize DI container', { error });
    }
  }

  public static get<T>(name: ServiceName): T {
    const service = this.services.get(name);
    if (!service) {
      throw new InjectableError('Failed to get service', { name });
    }

    return service as T;
  }
}
