# Interpreter

## Intent

Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.

## Problem

An e-commerce platform needs a flexible discount rule engine where business users can define rules like "10% off orders above $100" or "flat $5 off plus 15% off for VIP customers." Hard-coding every possible discount combination results in an explosion of special-case logic. When new promotions launch, developers must write and deploy new code for each one.

## Solution

The Interpreter pattern defines a mini-language for discount rules (e.g., `PERCENT 10 IF TOTAL_ABOVE 100`) and builds an abstract syntax tree (AST) of expression objects. A parser service translates the rule string into composable expression objects, and each expression evaluates itself against a context containing the order's total, item count, and customer type.

## Structure

- **Abstract Expression** -- `Expression` interface: Declares `interpret(context)` returning a discount amount.
- **Terminal Expressions** -- `PercentDiscountExpression`, `FlatDiscountExpression`: Compute a single discount value.
- **Non-Terminal Expressions** -- `ConditionalExpression`, `AndExpression`: Compose other expressions by adding conditions or combining multiple discounts.
- **Context** -- `DiscountContext`: Holds the `totalAmount`, `itemCount`, and `customerType` against which rules are evaluated.
- **Parser / Client** -- `DiscountParserService`: Parses rule strings into expression trees.

## E-Commerce Example

This implementation provides a **discount rule DSL** (domain-specific language) for an e-commerce platform. The supported grammar:

| Rule Format | Example | Meaning |
|---|---|---|
| `PERCENT <n>` | `PERCENT 10` | 10% off the total |
| `FLAT <n>` | `FLAT 5` | $5 off |
| `<rule> IF TOTAL_ABOVE <n>` | `PERCENT 10 IF TOTAL_ABOVE 100` | 10% off if total exceeds $100 |
| `<rule> IF ITEMS_ABOVE <n>` | `FLAT 15 IF ITEMS_ABOVE 5` | $15 off if more than 5 items |
| `<rule> IF CUSTOMER_IS <type>` | `PERCENT 20 IF CUSTOMER_IS vip` | 20% off for VIP customers |
| `<rule> AND <rule>` | `FLAT 5 AND PERCENT 10` | Both discounts combined |

The `DiscountParserService` recursively parses rule strings, handling `AND` combinators first (lowest precedence), then `IF` conditionals, and finally the base `PERCENT`/`FLAT` expressions. The resulting expression tree is evaluated against a `DiscountContext`.

## When to Use

- You have a simple, well-defined language or grammar that needs to be interpreted.
- Business rules need to be expressed as configurable strings rather than compiled code.
- The grammar is relatively stable but the rules change frequently.
- You need to combine simple rules into complex expressions using a compositional structure.
- Non-developers need to define and modify rules.

## When NOT to Use

- The grammar is complex -- consider a full parser generator (ANTLR, PEG.js) instead.
- Performance is critical -- interpreting an AST is slower than compiled or template-based approaches.
- Rule changes are infrequent enough that simple configuration or strategy selection suffices.

## NestJS Integration

The `DiscountParserService` is an `@Injectable()` service that NestJS injects into the controller. It acts as both the parser and the client of the expression tree. The service throws `BadRequestException` for invalid rule syntax, leveraging NestJS error handling. Expression classes are plain TypeScript classes without framework dependencies, keeping the pattern logic portable.

## API Endpoints

### POST /interpreter/discounts/evaluate

Parses a discount rule string and evaluates it against the provided context.

```bash
curl -X POST http://localhost:3000/interpreter/discounts/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "rule": "PERCENT 10 IF TOTAL_ABOVE 100",
    "context": {
      "totalAmount": 250,
      "itemCount": 3,
      "customerType": "regular"
    }
  }'
```

**Expected response:**

```json
{
  "rule": "PERCENT 10 IF TOTAL_ABOVE 100",
  "context": {
    "totalAmount": 250,
    "itemCount": 3,
    "customerType": "regular"
  },
  "discountAmount": 25,
  "finalPrice": 225
}
```

**Combined discount example:**

```bash
curl -X POST http://localhost:3000/interpreter/discounts/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "rule": "FLAT 5 AND PERCENT 10",
    "context": {
      "totalAmount": 200,
      "itemCount": 4,
      "customerType": "vip"
    }
  }'
```

**Expected response:**

```json
{
  "rule": "FLAT 5 AND PERCENT 10",
  "context": { "totalAmount": 200, "itemCount": 4, "customerType": "vip" },
  "discountAmount": 25,
  "finalPrice": 175
}
```

## Key Files

| File | Description |
|------|-------------|
| `expression.interface.ts` | Defines the `Expression` interface and `DiscountContext` type |
| `percent-discount.expression.ts` | Terminal expression that calculates a percentage-based discount |
| `flat-discount.expression.ts` | Terminal expression that returns a fixed dollar discount |
| `conditional.expression.ts` | Non-terminal expression that applies a discount only when a condition is met |
| `and.expression.ts` | Non-terminal expression that sums the results of two sub-expressions |
| `discount-parser.service.ts` | Injectable service that parses rule strings into expression trees |
| `interpreter.controller.ts` | Exposes the `POST /interpreter/discounts/evaluate` endpoint |
| `interpreter.module.ts` | NestJS module registering the controller and parser service |

## Related Patterns

- **Composite** -- The Interpreter pattern uses a composite structure (expression trees) where non-terminal expressions contain child expressions.
- **Strategy** -- Both encapsulate algorithms, but Strategy swaps entire algorithms while Interpreter builds complex behavior by composing grammar rules.
- **Visitor** -- Can be used to traverse and operate on the nodes of an interpreter's expression tree without modifying the node classes.
