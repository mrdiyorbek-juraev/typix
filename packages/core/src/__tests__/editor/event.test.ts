import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TypixEventEmitter } from '../../editor/event'
import type { TypixEventMap } from '../../types'

// Minimal mock payloads — use type assertions to avoid needing real editor instances
const focusPayload = { editor: {} } as TypixEventMap['focus']
const blurPayload = { editor: {} } as TypixEventMap['blur']

describe('TypixEventEmitter', () => {
  let emitter: TypixEventEmitter

  beforeEach(() => {
    emitter = new TypixEventEmitter()
  })

  // ── on / off ────────────────────────────────────────────────────────────

  describe('on', () => {
    it('registers a listener that receives the emitted payload', () => {
      const listener = vi.fn()
      emitter.on('focus', listener)
      emitter.emit('focus', focusPayload)
      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(focusPayload)
    })

    it('returns an unsubscribe function that stops the listener', () => {
      const listener = vi.fn()
      const unsub = emitter.on('focus', listener)
      unsub()
      emitter.emit('focus', focusPayload)
      expect(listener).not.toHaveBeenCalled()
    })

    it('allows multiple listeners for the same event', () => {
      const a = vi.fn()
      const b = vi.fn()
      emitter.on('focus', a)
      emitter.on('focus', b)
      emitter.emit('focus', focusPayload)
      expect(a).toHaveBeenCalledOnce()
      expect(b).toHaveBeenCalledOnce()
    })
  })

  describe('off', () => {
    it('removes a specific listener without affecting others', () => {
      const a = vi.fn()
      const b = vi.fn()
      emitter.on('focus', a)
      emitter.on('focus', b)
      emitter.off('focus', a)
      emitter.emit('focus', focusPayload)
      expect(a).not.toHaveBeenCalled()
      expect(b).toHaveBeenCalledOnce()
    })

    it('does not throw when removing a listener that was never registered', () => {
      expect(() => emitter.off('focus', vi.fn())).not.toThrow()
    })
  })

  // ── once ────────────────────────────────────────────────────────────────

  describe('once', () => {
    it('fires the listener exactly once then auto-unsubscribes', () => {
      const listener = vi.fn()
      emitter.once('focus', listener)
      emitter.emit('focus', focusPayload)
      emitter.emit('focus', focusPayload)
      expect(listener).toHaveBeenCalledOnce()
    })

    it('receives the correct payload on the single invocation', () => {
      const listener = vi.fn()
      emitter.once('focus', listener)
      emitter.emit('focus', focusPayload)
      expect(listener).toHaveBeenCalledWith(focusPayload)
    })

    it('returns an unsubscribe function that prevents the call', () => {
      const listener = vi.fn()
      const unsub = emitter.once('focus', listener)
      unsub()
      emitter.emit('focus', focusPayload)
      expect(listener).not.toHaveBeenCalled()
    })
  })

  // ── emit ────────────────────────────────────────────────────────────────

  describe('emit', () => {
    it('calls listeners in registration order', () => {
      const calls: number[] = []
      emitter.on('focus', () => calls.push(1))
      emitter.on('focus', () => calls.push(2))
      emitter.emit('focus', focusPayload)
      expect(calls).toEqual([1, 2])
    })

    it('does not throw when a listener throws', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      emitter.on('focus', () => { throw new Error('listener boom') })
      expect(() => emitter.emit('focus', focusPayload)).not.toThrow()
      error.mockRestore()
    })

    it('continues calling subsequent listeners after one throws', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      const good = vi.fn()
      emitter.on('focus', () => { throw new Error('oops') })
      emitter.on('focus', good)
      emitter.emit('focus', focusPayload)
      expect(good).toHaveBeenCalledOnce()
      error.mockRestore()
    })

    it('does nothing when no listeners are registered for that event', () => {
      expect(() => emitter.emit('focus', focusPayload)).not.toThrow()
    })

    it('does not cross-fire between different event types', () => {
      const focusListener = vi.fn()
      const blurListener = vi.fn()
      emitter.on('focus', focusListener)
      emitter.on('blur', blurListener)
      emitter.emit('focus', focusPayload)
      expect(focusListener).toHaveBeenCalledOnce()
      expect(blurListener).not.toHaveBeenCalled()
    })
  })

  // ── removeAllListeners ──────────────────────────────────────────────────

  describe('removeAllListeners', () => {
    it('removes all listeners across all events when called without argument', () => {
      const a = vi.fn()
      const b = vi.fn()
      emitter.on('focus', a)
      emitter.on('blur', b)
      emitter.removeAllListeners()
      emitter.emit('focus', focusPayload)
      emitter.emit('blur', blurPayload)
      expect(a).not.toHaveBeenCalled()
      expect(b).not.toHaveBeenCalled()
    })

    it('removes only listeners for the specified event', () => {
      const a = vi.fn()
      const b = vi.fn()
      emitter.on('focus', a)
      emitter.on('blur', b)
      emitter.removeAllListeners('focus')
      emitter.emit('focus', focusPayload)
      emitter.emit('blur', blurPayload)
      expect(a).not.toHaveBeenCalled()
      expect(b).toHaveBeenCalledOnce()
    })
  })
})
