import { Request, Response } from 'express';
import { ContentGenerator } from '../services/aiService';
import { PlatformOptimizer } from '../services/platformOptimizer';
import { SchedulerService } from '../services/schedulerService';

export class ContentController {
  private contentGenerator: ContentGenerator;
  private platformOptimizer: PlatformOptimizer;
  private schedulerService: SchedulerService;

  constructor() {
    this.contentGenerator = new ContentGenerator();
    this.platformOptimizer = new PlatformOptimizer();
    this.schedulerService = new SchedulerService();
  }

  async transformContent(req: Request, res: Response) {
    try {
      const { content, platform, brandVoice } = req.body;
      const transformedContent = await this.contentGenerator.transformContent(
        content,
        platform,
        brandVoice
      );
      const optimizedContent = this.platformOptimizer.optimizeForPlatform(
        transformedContent,
        platform
      );
      res.json({ content: optimizedContent });
    } catch (error) {
      res.status(500).json({ error: 'Content transformation failed' });
    }
  }

  async schedulePost(req: Request, res: Response) {
    try {
      const { content, platform, scheduledTime } = req.body;
      await this.schedulerService.schedulePost({
        content,
        platform,
        scheduledTime,
        status: 'pending'
      });
      res.json({ message: 'Post scheduled successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Scheduling failed' });
    }
  }
} 