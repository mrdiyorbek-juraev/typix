import { describe, expectTypeOf, it } from 'vitest'
import type { CommandFn } from '../../types'
import type {
  ExtensionCommands,
  ExtensionStorage,
  TypixExtension,
} from '../../extension'

// These tests reason purely at the type level. Concrete values don't exist at
// runtime — we use expectTypeOf's generic form to keep runtime code free of
// references that would crash.

describe('TypixExtension brand carries Storage + Commands generics', () => {
  type Storage = { count: number; label: string }
  type Commands = {
    toggleBold: () => CommandFn
    setHeading: (attrs: { level: 1 | 2 | 3 }) => CommandFn
  }

  type ExtWithStorage = TypixExtension<Storage, Record<never, never>>
  type ExtWithoutStorage = TypixExtension<void, Record<never, never>>
  type ExtWithCommands = TypixExtension<void, Commands>

  it('ExtensionStorage<E> recovers the Storage type', () => {
    expectTypeOf<ExtensionStorage<ExtWithStorage>>().toEqualTypeOf<Storage>()
  })

  it('ExtensionStorage<E> resolves to void when no storage is declared', () => {
    expectTypeOf<ExtensionStorage<ExtWithoutStorage>>().toEqualTypeOf<void>()
  })

  it('ExtensionCommands<E> recovers the Commands record', () => {
    expectTypeOf<ExtensionCommands<ExtWithCommands>>().toEqualTypeOf<Commands>()
  })

  it('ExtensionCommands<E> preserves per-command parameter types', () => {
    expectTypeOf<
      Parameters<ExtensionCommands<ExtWithCommands>['setHeading']>
    >().toEqualTypeOf<[attrs: { level: 1 | 2 | 3 }]>()
    expectTypeOf<
      ReturnType<ExtensionCommands<ExtWithCommands>['toggleBold']>
    >().toEqualTypeOf<CommandFn>()
  })
})
