import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { WeightEntry } from '../../features/weight-tracker/models/weight-entry.model';

export interface AIInsight {
  id: string;
  title: string;
  message: string;
  type: 'progress' | 'motivation' | 'recommendation' | 'achievement';
  icon: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AiInsightsService {
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private readonly API_KEY = environment.geminiApiKey;

  constructor(private http: HttpClient) {}

  /**
   * Generate AI insights based on weight entries
   */
  generateInsights(entries: WeightEntry[], userHeight?: number): Observable<AIInsight[]> {
    if (!entries || entries.length === 0) {
      return of(this.getDefaultInsights());
    }

    const prompt = this.buildPrompt(entries, userHeight);
    
    return this.callGeminiAPI(prompt).pipe(
      map(response => this.parseGeminiResponse(response)),
      catchError(error => {
        console.error('Error generating insights:', error);
        return of(this.getDefaultInsights());
      })
    );
  }

  /**
   * Build prompt for Gemini API
   */
  private buildPrompt(entries: WeightEntry[], userHeight?: number): string {
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstEntry = sortedEntries[0];
    const lastEntry = sortedEntries[sortedEntries.length - 1];
    
    // Get display weights (convert from kg if needed)
    const firstWeight = firstEntry.units === 'lb' ? firstEntry.weightKg / 0.453592 : firstEntry.weightKg;
    const lastWeight = lastEntry.units === 'lb' ? lastEntry.weightKg / 0.453592 : lastEntry.weightKg;
    const weightChange = lastWeight - firstWeight;
    
    const daysBetween = Math.floor(
      (new Date(lastEntry.date).getTime() - new Date(firstEntry.date).getTime()) / (1000 * 60 * 60 * 24)
    );

    let prompt = `You are a fitness coach analyzing weight tracking data. Generate 3 personalized insights based on this data:

Weight Data:
- Total entries: ${entries.length}
- First weight: ${firstWeight.toFixed(1)} ${firstEntry.units || 'kg'}
- Latest weight: ${lastWeight.toFixed(1)} ${lastEntry.units || 'kg'}
- Weight change: ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} ${lastEntry.units || 'kg'}
- Days tracked: ${daysBetween}
- Average entries per week: ${((entries.length / daysBetween) * 7).toFixed(1)}
`;

    if (userHeight) {
      const heightInMeters = userHeight / 100;
      const weightInKg = lastEntry.weightKg;
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      prompt += `- Current BMI: ${bmi.toFixed(1)}\n`;
    }

    prompt += `
Generate exactly 3 insights in this JSON format:
[
  {
    "title": "Short title (max 5 words)",
    "message": "Encouraging message (max 100 characters)",
    "type": "progress|motivation|recommendation|achievement"
  }
]

Rules:
1. Be positive and encouraging
2. Focus on progress, not perfection
3. Give actionable advice
4. Keep messages concise
5. Use emojis sparingly
6. Return ONLY valid JSON array, no other text

Example types:
- progress: Weight trends, consistency
- motivation: Encouragement, keep going
- recommendation: Health tips, suggestions
- achievement: Milestones reached`;

    return prompt;
  }

  /**
   * Call Gemini API
   */
  private callGeminiAPI(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const url = `${this.GEMINI_API_URL}?key=${this.API_KEY}`;

    return this.http.post(url, body, { headers });
  }

  /**
   * Parse Gemini API response
   */
  private parseGeminiResponse(response: any): AIInsight[] {
    try {
      const text = response.candidates[0].content.parts[0].text;
      
      // Extract JSON from response (Gemini might wrap it in markdown)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No JSON found in response');
        return this.getDefaultInsights();
      }

      const insights = JSON.parse(jsonMatch[0]);
      
      return insights.map((insight: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        title: insight.title,
        message: insight.message,
        type: insight.type || 'motivation',
        icon: this.getIconForType(insight.type),
        timestamp: new Date()
      }));
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return this.getDefaultInsights();
    }
  }

  /**
   * Get icon for insight type
   */
  private getIconForType(type: string): string {
    const icons: { [key: string]: string } = {
      progress: '📈',
      motivation: '💪',
      recommendation: '💡',
      achievement: '🏆'
    };
    return icons[type] || '✨';
  }

  /**
   * Get default insights when API fails or no data
   */
  private getDefaultInsights(): AIInsight[] {
    return [
      {
        id: 'default-1',
        title: 'Start Your Journey',
        message: 'Begin tracking your weight to get personalized insights!',
        type: 'motivation',
        icon: '🚀',
        timestamp: new Date()
      },
      {
        id: 'default-2',
        title: 'Consistency is Key',
        message: 'Track daily for the best results and insights.',
        type: 'recommendation',
        icon: '💡',
        timestamp: new Date()
      },
      {
        id: 'default-3',
        title: 'You Got This',
        message: 'Every entry brings you closer to your goals!',
        type: 'motivation',
        icon: '💪',
        timestamp: new Date()
      }
    ];
  }
}
