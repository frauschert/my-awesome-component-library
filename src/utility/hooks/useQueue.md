# useQueue

A React hook for managing a FIFO (First-In-First-Out) queue data structure with full type safety and comprehensive operations.

## Features

-   📥 **FIFO Operations**: Enqueue, dequeue, peek with proper ordering
-   🔢 **Size Management**: Optional max size with overflow protection
-   🎯 **State Tracking**: isEmpty, isFull, size properties
-   🔍 **Advanced Operations**: Remove by predicate, clear, toArray
-   🎭 **Type Safe**: Full TypeScript support with generics
-   ⚡ **React Optimized**: Uses useState and useCallback for performance

## Basic Usage

```tsx
import { useQueue } from 'my-awesome-component-library'

function QueueDemo() {
    const { queue, enqueue, dequeue, peek, size, isEmpty } = useQueue<string>()

    return (
        <div>
            <button onClick={() => enqueue('Item ' + (size + 1))}>
                Add Item
            </button>
            <button onClick={dequeue} disabled={isEmpty}>
                Remove First
            </button>
            <p>First item: {peek()}</p>
            <p>Queue size: {size}</p>
            <ul>
                {queue.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}
```

## Task Queue

```tsx
interface Task {
    id: number
    name: string
    priority: 'high' | 'normal' | 'low'
}

function TaskQueue() {
    const { queue, enqueue, dequeue, peek, isEmpty, size } = useQueue<Task>()
    const [processing, setProcessing] = useState(false)

    const addTask = (name: string, priority: Task['priority'] = 'normal') => {
        enqueue({
            id: Date.now(),
            name,
            priority,
        })
    }

    const processNext = async () => {
        const task = dequeue()
        if (!task) return

        setProcessing(true)
        try {
            await performTask(task)
            console.log('Completed:', task.name)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div>
            <h3>Task Queue ({size} pending)</h3>

            <div>
                <button onClick={() => addTask('High priority task', 'high')}>
                    Add High Priority
                </button>
                <button onClick={() => addTask('Normal task')}>
                    Add Normal Task
                </button>
            </div>

            <button onClick={processNext} disabled={isEmpty || processing}>
                {processing ? 'Processing...' : 'Process Next Task'}
            </button>

            {peek() && (
                <div>
                    <strong>Next task:</strong> {peek()!.name}
                </div>
            )}

            <ul>
                {queue.map((task) => (
                    <li key={task.id} className={task.priority}>
                        {task.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

## With Max Size (Bounded Queue)

```tsx
function BoundedQueue() {
    const maxSize = 5
    const { queue, enqueue, size, isFull, clear } = useQueue<number>(
        [],
        maxSize
    )

    const addNumber = () => {
        if (!isFull) {
            enqueue(Math.floor(Math.random() * 100))
        }
    }

    return (
        <div>
            <p>
                Queue: {size} / {maxSize}
            </p>
            <button onClick={addNumber} disabled={isFull}>
                Add Number {isFull && '(Full)'}
            </button>
            <button onClick={clear}>Clear</button>
            <div>Queue: [{queue.join(', ')}]</div>
        </div>
    )
}
```

## Message Queue

```tsx
interface Message {
    id: string
    text: string
    timestamp: Date
    sender: string
}

function MessageQueue() {
    const { queue, enqueue, dequeue, size } = useQueue<Message>()

    const sendMessage = (text: string, sender: string) => {
        enqueue({
            id: crypto.randomUUID(),
            text,
            timestamp: new Date(),
            sender,
        })
    }

    const processMessages = async () => {
        while (size > 0) {
            const message = dequeue()
            if (message) {
                await sendToServer(message)
                await new Promise((resolve) => setTimeout(resolve, 100))
            }
        }
    }

    return (
        <div>
            <h3>Message Queue ({size} pending)</h3>
            <button onClick={() => sendMessage('Hello!', 'User')}>
                Send Message
            </button>
            <button onClick={processMessages} disabled={size === 0}>
                Send All ({size})
            </button>
            <ul>
                {queue.map((msg) => (
                    <li key={msg.id}>
                        <strong>{msg.sender}:</strong> {msg.text}
                        <small>{msg.timestamp.toLocaleTimeString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

## Print Queue

```tsx
interface PrintJob {
    id: number
    document: string
    pages: number
    user: string
}

function PrintQueue() {
    const { queue, enqueue, dequeue, peek, isEmpty, remove } =
        useQueue<PrintJob>()
    const [printing, setPrinting] = useState(false)

    const addJob = (document: string, pages: number, user: string) => {
        enqueue({
            id: Date.now(),
            document,
            pages,
            user,
        })
    }

    const printNext = async () => {
        const job = peek()
        if (!job) return

        setPrinting(true)
        try {
            await simulatePrinting(job.pages)
            dequeue() // Remove after successful printing
            console.log('Printed:', job.document)
        } catch (error) {
            console.error('Print failed:', error)
        } finally {
            setPrinting(false)
        }
    }

    const cancelJob = (id: number) => {
        remove((job) => job.id === id)
    }

    return (
        <div>
            <h3>Print Queue</h3>
            <button onClick={printNext} disabled={isEmpty || printing}>
                {printing ? 'Printing...' : 'Print Next'}
            </button>

            {peek() && (
                <div className="current-job">
                    <strong>Currently printing:</strong>
                    <div>
                        {peek()!.document} ({peek()!.pages} pages)
                    </div>
                </div>
            )}

            <h4>Pending Jobs ({queue.length}):</h4>
            <ul>
                {queue.slice(1).map((job) => (
                    <li key={job.id}>
                        {job.document} - {job.pages} pages by {job.user}
                        <button onClick={() => cancelJob(job.id)}>
                            Cancel
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

## Event Queue

```tsx
interface Event {
    type: 'click' | 'scroll' | 'resize'
    timestamp: number
    data: unknown
}

function EventQueue() {
    const { queue, enqueue, dequeue, size, clear } = useQueue<Event>([], 100)

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            enqueue({
                type: 'click',
                timestamp: Date.now(),
                data: { x: e.clientX, y: e.clientY },
            })
        }

        const handleScroll = () => {
            enqueue({
                type: 'scroll',
                timestamp: Date.now(),
                data: { scrollY: window.scrollY },
            })
        }

        window.addEventListener('click', handleClick)
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('click', handleClick)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [enqueue])

    const processEvents = () => {
        while (size > 0) {
            const event = dequeue()
            if (event) {
                console.log('Processing event:', event)
                // Send to analytics, etc.
            }
        }
    }

    return (
        <div>
            <h3>Event Queue ({size} events)</h3>
            <button onClick={processEvents}>Process All Events</button>
            <button onClick={clear}>Clear Queue</button>
            <div>
                {queue.slice(-5).map((event, i) => (
                    <div key={i}>
                        {event.type} at{' '}
                        {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                ))}
            </div>
        </div>
    )
}
```

## Animation Queue

```tsx
interface Animation {
    id: string
    element: string
    duration: number
    type: 'fade' | 'slide' | 'zoom'
}

function AnimationQueue() {
    const { queue, enqueue, dequeue, peek, isEmpty } = useQueue<Animation>()
    const [playing, setPlaying] = useState(false)

    const queueAnimation = (
        element: string,
        type: Animation['type'],
        duration: number
    ) => {
        enqueue({
            id: crypto.randomUUID(),
            element,
            duration,
            type,
        })
    }

    const playQueue = async () => {
        if (playing) return

        setPlaying(true)

        while (!isEmpty) {
            const animation = peek()
            if (!animation) break

            await playAnimation(animation)
            dequeue()
        }

        setPlaying(false)
    }

    return (
        <div>
            <h3>Animation Queue</h3>
            <button onClick={() => queueAnimation('box1', 'fade', 1000)}>
                Queue Fade
            </button>
            <button onClick={() => queueAnimation('box2', 'slide', 800)}>
                Queue Slide
            </button>
            <button onClick={playQueue} disabled={isEmpty || playing}>
                {playing ? 'Playing...' : 'Play Animations'}
            </button>

            <div>
                <h4>Queued ({queue.length}):</h4>
                {queue.map((anim, i) => (
                    <div key={anim.id}>
                        {i + 1}. {anim.type} on {anim.element} ({anim.duration}
                        ms)
                    </div>
                ))}
            </div>
        </div>
    )
}
```

## Request Queue

```tsx
interface APIRequest {
    id: string
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: unknown
}

function RequestQueue() {
    const { queue, enqueue, dequeue, size, isEmpty } = useQueue<APIRequest>()
    const [processing, setProcessing] = useState(false)

    const queueRequest = (
        url: string,
        method: APIRequest['method'],
        data?: unknown
    ) => {
        enqueue({
            id: crypto.randomUUID(),
            url,
            method,
            data,
        })
    }

    useEffect(() => {
        const processQueue = async () => {
            if (processing || isEmpty) return

            setProcessing(true)
            const request = dequeue()

            if (request) {
                try {
                    await fetch(request.url, {
                        method: request.method,
                        body: request.data
                            ? JSON.stringify(request.data)
                            : undefined,
                    })
                    console.log('Request completed:', request.id)
                } catch (error) {
                    console.error('Request failed:', error)
                    // Re-queue failed request
                    enqueue(request)
                }
            }

            setProcessing(false)
        }

        processQueue()
    }, [size, processing, isEmpty, dequeue, enqueue])

    return (
        <div>
            <h3>Request Queue</h3>
            <p>Pending requests: {size}</p>
            <button onClick={() => queueRequest('/api/data', 'GET')}>
                Queue GET Request
            </button>
            <button
                onClick={() =>
                    queueRequest('/api/data', 'POST', { foo: 'bar' })
                }
            >
                Queue POST Request
            </button>
            <ul>
                {queue.map((req) => (
                    <li key={req.id}>
                        {req.method} {req.url}
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

## Remove Items by Predicate

```tsx
interface User {
    id: number
    name: string
    status: 'active' | 'pending' | 'blocked'
}

function UserQueue() {
    const { queue, enqueue, remove, size } = useQueue<User>()

    const addUser = (name: string, status: User['status'] = 'pending') => {
        enqueue({
            id: Date.now(),
            name,
            status,
        })
    }

    const removeBlocked = () => {
        remove((user) => user.status === 'blocked')
    }

    const removePending = () => {
        remove((user) => user.status === 'pending')
    }

    const removeByName = (name: string) => {
        remove((user) => user.name === name)
    }

    return (
        <div>
            <h3>User Queue ({size} users)</h3>
            <button onClick={removeBlocked}>Remove Blocked</button>
            <button onClick={removePending}>Remove Pending</button>
            <ul>
                {queue.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.status}
                        <button onClick={() => removeByName(user.name)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

## Export Queue as Array

```tsx
function ExportableQueue() {
    const { queue, enqueue, toArray, clear } = useQueue<string>()

    const exportToJSON = () => {
        const data = toArray()
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'queue-export.json'
        a.click()
    }

    const exportToCSV = () => {
        const data = toArray()
        const csv = data.join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'queue-export.csv'
        a.click()
    }

    return (
        <div>
            <button onClick={() => enqueue('Item ' + (queue.length + 1))}>
                Add Item
            </button>
            <button onClick={exportToJSON}>Export as JSON</button>
            <button onClick={exportToCSV}>Export as CSV</button>
            <button onClick={clear}>Clear</button>
            <ul>
                {queue.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    )
}
```

## API

### Parameters

```typescript
function useQueue<T>(initialQueue?: T[], maxSize?: number): UseQueueReturn<T>
```

#### `initialQueue`

-   **Type**: `T[]`
-   **Optional**: Yes
-   **Default**: `[]`
-   **Description**: Initial items in the queue

#### `maxSize`

-   **Type**: `number`
-   **Optional**: Yes
-   **Default**: `undefined` (unlimited)
-   **Description**: Maximum number of items the queue can hold. When full, enqueue operations will be rejected with a warning.

### Return Value

```typescript
interface UseQueueReturn<T> {
    // State
    queue: T[]
    size: number
    isEmpty: boolean
    isFull: boolean

    // Operations
    enqueue: (item: T) => void
    dequeue: () => T | undefined
    peek: () => T | undefined
    clear: () => void
    remove: (predicate: (item: T) => boolean) => void
    toArray: () => T[]
}
```

#### State Properties

##### `queue`

-   **Type**: `T[]`
-   **Description**: The current queue items in FIFO order

##### `size`

-   **Type**: `number`
-   **Description**: Number of items in the queue

##### `isEmpty`

-   **Type**: `boolean`
-   **Description**: `true` if the queue has no items

##### `isFull`

-   **Type**: `boolean`
-   **Description**: `true` if the queue has reached maxSize (always `false` if maxSize is not set)

#### Operations

##### `enqueue(item: T): void`

Add an item to the end of the queue. If maxSize is set and queue is full, the operation is rejected with a console warning.

##### `dequeue(): T | undefined`

Remove and return the first item from the queue. Returns `undefined` if queue is empty.

##### `peek(): T | undefined`

Return the first item without removing it. Returns `undefined` if queue is empty.

##### `clear(): void`

Remove all items from the queue.

##### `remove(predicate: (item: T) => boolean): void`

Remove all items matching the predicate function.

##### `toArray(): T[]`

Return a copy of the queue as an array. Modifying the returned array does not affect the queue.

## Use Cases

-   **Task Processing**: Background job queues, batch processing
-   **Message Systems**: Chat message queues, notification systems
-   **Request Management**: API request queues with rate limiting
-   **Print Spooling**: Document print queues
-   **Animation**: Sequential animation queues
-   **Event Handling**: Event buffering and batch processing
-   **File Uploads**: Sequential file upload queues
-   **Command Pattern**: Undo/redo command queues

## TypeScript

The hook is fully typed with TypeScript generics:

```typescript
import {
    useQueue,
    UseQueueReturn,
    UseQueueActions,
} from 'my-awesome-component-library'

// With explicit type
const taskQueue: UseQueueReturn<Task> = useQueue<Task>()

// Type inference
const numberQueue = useQueue<number>([1, 2, 3])

// With maxSize
const boundedQueue = useQueue<string>([], 100)
```

## Notes

-   Queue operations maintain FIFO (First-In-First-Out) order
-   `dequeue()` returns the actual removed item, not just a status
-   When `maxSize` is set, attempting to enqueue to a full queue logs a warning
-   Initial queue can exceed maxSize, but subsequent enqueues will be blocked
-   All operations are type-safe with TypeScript generics
-   `toArray()` returns a copy, preventing accidental mutations
