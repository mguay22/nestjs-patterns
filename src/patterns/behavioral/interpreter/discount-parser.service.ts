import { Injectable, BadRequestException } from '@nestjs/common';
import { Expression } from './expression.interface.js';
import { PercentDiscountExpression } from './percent-discount.expression.js';
import { FlatDiscountExpression } from './flat-discount.expression.js';
import { ConditionalExpression, ConditionType } from './conditional.expression.js';
import { AndExpression } from './and.expression.js';

@Injectable()
export class DiscountParserService {
  parse(rule: string): Expression {
    const trimmed = rule.trim().toUpperCase();

    // Handle AND combinator: "FLAT 5 AND PERCENT 10"
    const andIndex = trimmed.indexOf(' AND ');
    if (andIndex !== -1) {
      const leftRule = rule.trim().substring(0, andIndex);
      const rightRule = rule.trim().substring(andIndex + 5);
      return new AndExpression(this.parse(leftRule), this.parse(rightRule));
    }

    // Handle conditional: "PERCENT 10 IF TOTAL_ABOVE 100"
    const ifIndex = trimmed.indexOf(' IF ');
    if (ifIndex !== -1) {
      const expressionPart = rule.trim().substring(0, ifIndex);
      const conditionPart = rule.trim().substring(ifIndex + 4).trim();
      const innerExpression = this.parse(expressionPart);
      return this.parseCondition(conditionPart, innerExpression);
    }

    // Handle base expressions
    if (trimmed.startsWith('PERCENT ')) {
      const value = parseFloat(trimmed.substring(8));
      if (isNaN(value)) {
        throw new BadRequestException(`Invalid percentage value in rule: "${rule}"`);
      }
      return new PercentDiscountExpression(value);
    }

    if (trimmed.startsWith('FLAT ')) {
      const value = parseFloat(trimmed.substring(5));
      if (isNaN(value)) {
        throw new BadRequestException(`Invalid flat discount value in rule: "${rule}"`);
      }
      return new FlatDiscountExpression(value);
    }

    throw new BadRequestException(
      `Unknown rule format: "${rule}". Supported: "PERCENT <n>", "FLAT <n>", "<rule> IF <condition>", "<rule> AND <rule>"`,
    );
  }

  private parseCondition(conditionPart: string, innerExpression: Expression): ConditionalExpression {
    const tokens = conditionPart.trim().split(/\s+/);

    if (tokens.length < 2) {
      throw new BadRequestException(`Invalid condition: "${conditionPart}"`);
    }

    const conditionType = tokens[0].toUpperCase() as ConditionType;
    const conditionValue = tokens[1];

    const validConditions: ConditionType[] = ['TOTAL_ABOVE', 'ITEMS_ABOVE', 'CUSTOMER_IS'];
    if (!validConditions.includes(conditionType)) {
      throw new BadRequestException(
        `Unknown condition type: "${conditionType}". Supported: ${validConditions.join(', ')}`,
      );
    }

    return new ConditionalExpression(conditionType, conditionValue, innerExpression);
  }
}
