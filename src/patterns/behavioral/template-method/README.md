# Template Method

## Intent

Define the skeleton of an algorithm in an operation, deferring some steps to subclasses so that subclasses can redefine certain steps of the algorithm without changing its structure.

## Problem

An e-commerce platform needs to generate different types of reports -- sales, inventory, and customer reports. Each report follows the same overall process (gather data, process data, format report), but the specifics of what data to gather and how to format the output differ for each report type. Duplicating the algorithm structure across every report generator leads to code repetition and makes it hard to enforce a consistent report generation flow.

## Solution

The Template Method pattern defines the algorithm skeleton in an abstract base class (`ReportGenerator`), with the invariant steps implemented in the base and the variant steps declared as abstract methods. Subclasses override only the steps that differ -- `gatherData()` and `formatReport()` -- while the `generate()` method enforces the overall sequence. The `processData()` step provides a default implementation that subclasses may optionally override.

## Structure

- **Abstract Class** -- `ReportGenerator`: Defines the `generate()` template method and declares abstract hooks `gatherData()` and `formatReport()`. Provides a default `processData()` implementation.
- **Concrete Classes** -- `SalesReportGenerator`, `InventoryReportGenerator`, `CustomerReportGenerator`: Each overrides the abstract methods with report-specific logic.
- **Client** -- `TemplateMethodController`: Selects the appropriate generator based on the URL parameter and calls `generate()`.

## E-Commerce Example

This implementation provides three **report generators** that all follow the same three-step algorithm:

1. **SalesReportGenerator**
   - `gatherData()`: Returns 6 hardcoded sales records (order ID, product, amount, date, region).
   - `formatReport()`: Computes total revenue, average order value, total orders, and revenue breakdown by region.

2. **InventoryReportGenerator**
   - `gatherData()`: Returns 6 hardcoded inventory records (SKU, name, stock level, reorder level, category, unit cost).
   - `formatReport()`: Identifies low-stock items (below reorder level), calculates total inventory value, and groups stock by category.

3. **CustomerReportGenerator**
   - `gatherData()`: Returns 5 hardcoded customer records (ID, name, total spent, order count, tier, join date).
   - `formatReport()`: Computes total revenue, average spend per customer, total orders, customer distribution by tier, and top 3 customers by spending.

All three generators inherit the same `generate()` flow and the default `processData()` implementation, which wraps the raw data with a record count and processing timestamp.

## When to Use

- Multiple classes share the same algorithm structure but differ in specific steps.
- You want to enforce a fixed sequence of operations while allowing customization of individual steps.
- You need to prevent subclasses from changing the overall algorithm structure.
- Common behavior should be factored into a single place to avoid duplication.
- You want to provide optional hooks that subclasses may override.

## When NOT to Use

- The algorithm has no fixed structure and each implementation is entirely different -- use Strategy instead.
- You have only one concrete implementation and no need for variation.
- The number of abstract steps is so large that subclasses must override most of the base class, offering little reuse benefit.

## NestJS Integration

The controller instantiates all three report generators in its constructor and stores them in a `Map` keyed by report type. The `GET /template-method/reports/:type` endpoint selects the generator by key and calls `generate()`. The generators are plain TypeScript classes with no NestJS dependencies, making them easy to test and reuse. The `TemplateMethodModule` registers only the controller since no injectable services are needed.

## API Endpoints

### GET /template-method/reports/:type

Generates a report of the specified type. Valid types: `sales`, `inventory`, `customer`.

**Sales report:**

```bash
curl http://localhost:3000/template-method/reports/sales
```

**Expected response:**

```json
{
  "title": "Sales Report",
  "generatedAt": "2026-02-16T12:00:00.000Z",
  "type": "sales",
  "data": {
    "records": [
      { "orderId": "ORD001", "product": "Laptop", "amount": 999.99, "date": "2026-02-01", "region": "North" },
      "...5 more records..."
    ],
    "totalRecords": 6,
    "processedAt": "2026-02-16T12:00:00.000Z"
  },
  "summary": {
    "totalRevenue": 2629.94,
    "averageOrderValue": 438.32,
    "totalOrders": 6,
    "revenueByRegion": { "North": 1529.97, "South": 49.99, "East": 699.99, "West": 349.99 }
  }
}
```

**Inventory report:**

```bash
curl http://localhost:3000/template-method/reports/inventory
```

**Customer report:**

```bash
curl http://localhost:3000/template-method/reports/customer
```

**Expected response (summary section):**

```json
{
  "summary": {
    "totalCustomers": 5,
    "totalRevenue": 12599.83,
    "averageSpendPerCustomer": 2519.97,
    "totalOrders": 30,
    "customersByTier": { "gold": 2, "bronze": 1, "platinum": 1, "silver": 1 },
    "topCustomers": [
      { "name": "Carol Williams", "totalSpent": 5899.94, "tier": "platinum" },
      { "name": "Eve Davis", "totalSpent": 3249.95, "tier": "gold" },
      { "name": "Alice Johnson", "totalSpent": 2499.97, "tier": "gold" }
    ]
  }
}
```

## Key Files

| File | Description |
|------|-------------|
| `report-generator.ts` | Abstract base class defining the `generate()` template method and abstract hooks |
| `sales-report.generator.ts` | Gathers sales data and formats revenue/region summaries |
| `inventory-report.generator.ts` | Gathers inventory data and identifies low-stock items |
| `customer-report.generator.ts` | Gathers customer data and ranks top customers by spending |
| `template-method.controller.ts` | Selects the generator by type and returns the generated report |
| `template-method.module.ts` | NestJS module registering the controller |

## Related Patterns

- **Strategy** -- Strategy uses composition to swap entire algorithms at runtime; Template Method uses inheritance to vary specific steps within a fixed algorithm structure.
- **Factory Method** -- Factory Method is often a specialization of Template Method, where the abstract step creates objects rather than performing computations.
- **Hook Method** -- Template Method often includes optional hook methods (like `processData()`) that subclasses may override but are not required to.
