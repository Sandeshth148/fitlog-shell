import { loadRemoteModule } from '@angular-architects/native-federation';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MicroFrontendService {

  constructor() { }

  async loadRemoteComponent(port: number, remoteName: string) {
    try {
      // Use environment-based URL in production, localhost in development
      const remoteEntry = environment.production 
        ? this.getProductionUrl(remoteName)
        : `http://localhost:${port}/remoteEntry.json`;

      return await loadRemoteModule({
        exposedModule: './Component',
        remoteName: remoteName,
        remoteEntry: remoteEntry,
        fallback: 'unauthorized'
      })
    } catch (err) {
      console.error(`Error loading ${remoteName} component: `, err);
      throw err;
    }
  }

  private getProductionUrl(remoteName: string): string {
    const urlMap: { [key: string]: string } = {
      'fitlog-streaks': environment.mfeUrls.streaks,
      'fitlog-ai-insights': environment.mfeUrls.aiInsights
    };
    
    return urlMap[remoteName] || `http://localhost:4200/remoteEntry.json`;
  }

}
