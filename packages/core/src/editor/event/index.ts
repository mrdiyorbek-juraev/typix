import type {
    TypixEventMap,
    TypixEventName,
    TypixEventListener,
} from '../../types';

/**
 * Lightweight typed event emitter for Typix.
 * Framework-free, no external dependencies.
 */
export class TypixEventEmitter {
    private listeners: Map<string, Set<TypixEventListener<TypixEventName>>> =
        new Map()

    on<TEvent extends TypixEventName>(
        event: TEvent,
        listener: TypixEventListener<TEvent>,
    ): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event)!.add(listener as TypixEventListener<TypixEventName>)
        return () => this.off(event, listener)
    }

    off<TEvent extends TypixEventName>(
        event: TEvent,
        listener: TypixEventListener<TEvent>,
    ): void {
        this.listeners.get(event)?.delete(
            listener as TypixEventListener<TypixEventName>,
        )
    }

    once<TEvent extends TypixEventName>(
        event: TEvent,
        listener: TypixEventListener<TEvent>,
    ): () => void {
        const wrapped: TypixEventListener<TEvent> = (payload) => {
            listener(payload)
            this.off(event, wrapped)
        }
        return this.on(event, wrapped)
    }

    emit<TEvent extends TypixEventName>(
        event: TEvent,
        payload: TypixEventMap[TEvent],
    ): void {
        this.listeners.get(event)?.forEach((listener) => {
            try {
                listener(payload as TypixEventMap[TypixEventName])
            } catch (err: unknown) {
                console.error(`[Typix] Error in "${event}" listener:`, err)
            }
        })
    }

    /** Remove all listeners, optionally for a specific event */
    removeAllListeners(event?: TypixEventName): void {
        if (event) {
            this.listeners.delete(event)
        } else {
            this.listeners.clear()
        }
    }
}