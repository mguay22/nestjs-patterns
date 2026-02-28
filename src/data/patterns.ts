export type Category = 'creational' | 'structural' | 'behavioral';
export type Complexity = 'low' | 'medium' | 'high';
export type Popularity = 'low' | 'medium' | 'high';

export interface PatternMeta {
  title: string;
  slug: string;
  category: Category;
  intent: string;
  complexity: Complexity;
  popularity: Popularity;
  order: number;
}

export const categoryMeta: Record<Category, { label: string; color: string; description: string; count: number }> = {
  creational: {
    label: 'Creational',
    color: 'cat-creational',
    description: 'Patterns that deal with object creation mechanisms, trying to create objects in a manner suitable to the situation.',
    count: 5,
  },
  structural: {
    label: 'Structural',
    color: 'cat-structural',
    description: 'Patterns that ease the design by identifying a simple way to realize relationships among entities.',
    count: 7,
  },
  behavioral: {
    label: 'Behavioral',
    color: 'cat-behavioral',
    description: 'Patterns that are concerned with algorithms and the assignment of responsibilities between objects.',
    count: 11,
  },
};

export const patterns: PatternMeta[] = [
  // Creational
  { title: 'Singleton', slug: 'singleton', category: 'creational', intent: 'Ensure a class has only one instance and provide a global point of access to it.', complexity: 'low', popularity: 'high', order: 1 },
  { title: 'Factory Method', slug: 'factory-method', category: 'creational', intent: 'Define an interface for creating an object, but let subclasses decide which class to instantiate.', complexity: 'medium', popularity: 'high', order: 2 },
  { title: 'Abstract Factory', slug: 'abstract-factory', category: 'creational', intent: 'Provide an interface for creating families of related or dependent objects without specifying their concrete classes.', complexity: 'high', popularity: 'medium', order: 3 },
  { title: 'Builder', slug: 'builder', category: 'creational', intent: 'Separate the construction of a complex object from its representation so that the same construction process can create different representations.', complexity: 'medium', popularity: 'high', order: 4 },
  { title: 'Prototype', slug: 'prototype', category: 'creational', intent: 'Create objects by cloning a prototype rather than constructing from scratch.', complexity: 'medium', popularity: 'medium', order: 5 },

  // Structural
  { title: 'Adapter', slug: 'adapter', category: 'structural', intent: 'Convert the interface of a class into another interface clients expect.', complexity: 'low', popularity: 'high', order: 1 },
  { title: 'Bridge', slug: 'bridge', category: 'structural', intent: 'Decouple an abstraction from its implementation so that the two can vary independently.', complexity: 'high', popularity: 'medium', order: 2 },
  { title: 'Composite', slug: 'composite', category: 'structural', intent: 'Compose objects into tree structures to represent part-whole hierarchies.', complexity: 'medium', popularity: 'medium', order: 3 },
  { title: 'Decorator', slug: 'decorator', category: 'structural', intent: 'Attach additional responsibilities to an object dynamically.', complexity: 'medium', popularity: 'high', order: 4 },
  { title: 'Facade', slug: 'facade', category: 'structural', intent: 'Provide a unified interface to a set of interfaces in a subsystem.', complexity: 'low', popularity: 'high', order: 5 },
  { title: 'Flyweight', slug: 'flyweight', category: 'structural', intent: 'Use sharing to support large numbers of fine-grained objects efficiently.', complexity: 'high', popularity: 'low', order: 6 },
  { title: 'Proxy', slug: 'proxy', category: 'structural', intent: 'Provide a surrogate or placeholder for another object to control access to it.', complexity: 'medium', popularity: 'high', order: 7 },

  // Behavioral
  { title: 'Chain of Responsibility', slug: 'chain-of-responsibility', category: 'behavioral', intent: 'Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request.', complexity: 'medium', popularity: 'medium', order: 1 },
  { title: 'Command', slug: 'command', category: 'behavioral', intent: 'Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.', complexity: 'medium', popularity: 'high', order: 2 },
  { title: 'Interpreter', slug: 'interpreter', category: 'behavioral', intent: 'Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.', complexity: 'high', popularity: 'low', order: 3 },
  { title: 'Iterator', slug: 'iterator', category: 'behavioral', intent: 'Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.', complexity: 'medium', popularity: 'high', order: 4 },
  { title: 'Mediator', slug: 'mediator', category: 'behavioral', intent: 'Define an object that encapsulates how a set of objects interact.', complexity: 'medium', popularity: 'medium', order: 5 },
  { title: 'Memento', slug: 'memento', category: 'behavioral', intent: 'Capture and externalize an object\'s internal state so that the object can be restored to this state later.', complexity: 'medium', popularity: 'medium', order: 6 },
  { title: 'Observer', slug: 'observer', category: 'behavioral', intent: 'Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.', complexity: 'medium', popularity: 'high', order: 7 },
  { title: 'State', slug: 'state', category: 'behavioral', intent: 'Allow an object to alter its behavior when its internal state changes.', complexity: 'medium', popularity: 'high', order: 8 },
  { title: 'Strategy', slug: 'strategy', category: 'behavioral', intent: 'Define a family of algorithms, encapsulate each one, and make them interchangeable.', complexity: 'low', popularity: 'high', order: 9 },
  { title: 'Template Method', slug: 'template-method', category: 'behavioral', intent: 'Define the skeleton of an algorithm in an operation, deferring some steps to subclasses.', complexity: 'medium', popularity: 'high', order: 10 },
  { title: 'Visitor', slug: 'visitor', category: 'behavioral', intent: 'Represent an operation to be performed on the elements of an object structure.', complexity: 'high', popularity: 'medium', order: 11 },
];

export function getPatternsByCategory(category: Category): PatternMeta[] {
  return patterns.filter(p => p.category === category).sort((a, b) => a.order - b.order);
}

export function getPatternBySlug(slug: string): PatternMeta | undefined {
  return patterns.find(p => p.slug === slug);
}
