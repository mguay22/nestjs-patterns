import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return pattern index', () => {
      const result = appController.getPatternIndex();
      expect(result.title).toBe('Gang of Four Design Patterns in NestJS');
      expect(result.patterns.creational).toHaveLength(5);
      expect(result.patterns.structural).toHaveLength(7);
      expect(result.patterns.behavioral).toHaveLength(11);
    });
  });
});
