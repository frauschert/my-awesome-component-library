# useStack

A React hook for managing a LIFO (Last-In-First-Out) stack data structure with full type safety and comprehensive operations.

## Features

-   📤 **LIFO Operations**: Push, pop, peek with proper ordering
-   🔢 **Size Management**: Optional max size with overflow protection
-   🎯 **State Tracking**: isEmpty, isFull, size properties
-   🔍 **Advanced Operations**: Remove by predicate, clear, toArray
-   🎭 **Type Safe**: Full TypeScript support with generics
-   ⚡ **React Optimized**: Uses useState and useCallback for performance

## Basic Usage

```tsx
import { useStack } from 'my-awesome-component-library'

function StackDemo() {
    const { stack, push, pop, peek, size, isEmpty } = useStack<string>()

    return (
        <div>
            <button onClick={() => push('Item ' + (size + 1))}>
                Push Item
            </button>
            <button onClick={pop} disabled={isEmpty}>
                Pop Top
            </button>
            <p>Top item: {peek()}</p>
            <p>Stack size: {size}</p>
            <ul>
                {stack.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}
```

## Undo/Redo System

```tsx
interface Action {
    type: string
    data: unknown
    timestamp: number
}

function UndoRedoEditor() {
    const undoStack = useStack<Action>()
    const redoStack = useStack<Action>()
    const [content, setContent] = useState('')

    const performAction = (type: string, data: unknown) => {
        const action: Action = {
            type,
            data,
            timestamp: Date.now(),
        }

        undoStack.push(action)
        redoStack.clear() // Clear redo stack on new action

        // Apply action
        applyAction(action)
    }

    const undo = () => {
        const action = undoStack.pop()
        if (action) {
            redoStack.push(action)
            reverseAction(action)
        }
    }

    const redo = () => {
        const action = redoStack.pop()
        if (action) {
            undoStack.push(action)
            applyAction(action)
        }
    }

    return (
        <div>
            <button onClick={undo} disabled={undoStack.isEmpty}>
                Undo ({undoStack.size})
            </button>
            <button onClick={redo} disabled={redoStack.isEmpty}>
                Redo ({redoStack.size})
            </button>

            <textarea
                value={content}
                onChange={(e) => performAction('EDIT', e.target.value)}
            />

            <div>
                <h4>Undo History:</h4>
                {undoStack.stack
                    .slice(-5)
                    .reverse()
                    .map((action, i) => (
                        <div key={i}>{action.type}</div>
                    ))}
            </div>
        </div>
    )
}
```

## Navigation History (Back/Forward)

```tsx
interface Page {
    url: string
    title: string
    scrollY: number
}

function BrowserHistory() {
    const backStack = useStack<Page>()
    const forwardStack = useStack<Page>()
    const [currentPage, setCurrentPage] = useState<Page>({
        url: '/',
        title: 'Home',
        scrollY: 0,
    })

    const navigate = (page: Page) => {
        backStack.push(currentPage)
        forwardStack.clear()
        setCurrentPage(page)
    }

    const goBack = () => {
        const previousPage = backStack.pop()
        if (previousPage) {
            forwardStack.push(currentPage)
            setCurrentPage(previousPage)
            // Restore scroll position
            window.scrollTo(0, previousPage.scrollY)
        }
    }

    const goForward = () => {
        const nextPage = forwardStack.pop()
        if (nextPage) {
            backStack.push(currentPage)
            setCurrentPage(nextPage)
            window.scrollTo(0, nextPage.scrollY)
        }
    }

    return (
        <div>
            <nav>
                <button onClick={goBack} disabled={backStack.isEmpty}>
                    ← Back
                </button>
                <button onClick={goForward} disabled={forwardStack.isEmpty}>
                    Forward →
                </button>
            </nav>

            <h1>{currentPage.title}</h1>
            <p>URL: {currentPage.url}</p>

            <div>
                <button
                    onClick={() =>
                        navigate({ url: '/about', title: 'About', scrollY: 0 })
                    }
                >
                    Go to About
                </button>
                <button
                    onClick={() =>
                        navigate({
                            url: '/contact',
                            title: 'Contact',
                            scrollY: 0,
                        })
                    }
                >
                    Go to Contact
                </button>
            </div>
        </div>
    )
}
```

## Call Stack Tracer

```tsx
interface FunctionCall {
    name: string
    args: unknown[]
    timestamp: number
}

function CallStackTracer() {
    const { stack, push, pop, peek } = useStack<FunctionCall>()

    const traceFunction = (name: string, args: unknown[]) => {
        const call: FunctionCall = {
            name,
            args,
            timestamp: Date.now(),
        }

        push(call)
        console.log(`Entering: ${name}`)

        return () => {
            const exitedCall = pop()
            console.log(`Exiting: ${exitedCall?.name}`)
        }
    }

    const executeWithTrace = async () => {
        const exit1 = traceFunction('main', [])

        const exit2 = traceFunction('fetchData', ['user-123'])
        await new Promise((resolve) => setTimeout(resolve, 100))
        exit2()

        const exit3 = traceFunction('processData', [{ id: 123 }])
        exit3()

        exit1()
    }

    return (
        <div>
            <button onClick={executeWithTrace}>Execute with Trace</button>

            <h3>Call Stack:</h3>
            <div style={{ fontFamily: 'monospace' }}>
                {stack.map((call, index) => (
                    <div key={index} style={{ paddingLeft: index * 20 }}>
                        {call.name}({JSON.stringify(call.args)})
                    </div>
                ))}
            </div>

            {peek() && (
                <div>
                    <strong>Current Function:</strong> {peek()!.name}
                </div>
            )}
        </div>
    )
}
```

## Expression Evaluator

```tsx
interface Token {
    type: 'number' | 'operator'
    value: string | number
}

function ExpressionEvaluator() {
    const { stack, push, pop, clear } = useStack<number>()
    const [expression, setExpression] = useState('')

    const evaluateRPN = (tokens: Token[]) => {
        clear()

        for (const token of tokens) {
            if (token.type === 'number') {
                push(token.value as number)
            } else {
                const b = pop()!
                const a = pop()!

                switch (token.value) {
                    case '+':
                        push(a + b)
                        break
                    case '-':
                        push(a - b)
                        break
                    case '*':
                        push(a * b)
                        break
                    case '/':
                        push(a / b)
                        break
                }
            }
        }

        return pop()
    }

    const calculate = () => {
        // Convert infix to RPN and evaluate
        const tokens = parseExpression(expression)
        const result = evaluateRPN(tokens)
        console.log('Result:', result)
    }

    return (
        <div>
            <input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Enter expression"
            />
            <button onClick={calculate}>Calculate</button>

            <h4>Stack State:</h4>
            <div>
                {stack.map((value, index) => (
                    <div key={index}>{value}</div>
                ))}
            </div>
        </div>
    )
}
```

## Parentheses Matcher

```tsx
function ParenthesesChecker() {
    const { stack, push, pop, peek, isEmpty } = useStack<string>()
    const [input, setInput] = useState('')
    const [isValid, setIsValid] = useState<boolean | null>(null)

    const checkParentheses = (str: string) => {
        stack.clear()
        const pairs: Record<string, string> = {
            ')': '(',
            ']': '[',
            '}': '{',
        }

        for (const char of str) {
            if (['(', '[', '{'].includes(char)) {
                push(char)
            } else if ([')', ']', '}'].includes(char)) {
                if (isEmpty || peek() !== pairs[char]) {
                    return false
                }
                pop()
            }
        }

        return isEmpty
    }

    const validate = () => {
        const valid = checkParentheses(input)
        setIsValid(valid)
    }

    return (
        <div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter expression with parentheses"
            />
            <button onClick={validate}>Check</button>

            {isValid !== null && (
                <div style={{ color: isValid ? 'green' : 'red' }}>
                    {isValid ? '✓ Valid' : '✗ Invalid'}
                </div>
            )}

            <h4>Stack:</h4>
            <div>{stack.join(' ')}</div>
        </div>
    )
}
```

## With Max Size (Bounded Stack)

```tsx
function BoundedStack() {
    const maxSize = 5
    const { stack, push, size, isFull, clear } = useStack<number>([], maxSize)

    const pushNumber = () => {
        if (!isFull) {
            push(Math.floor(Math.random() * 100))
        }
    }

    return (
        <div>
            <p>
                Stack: {size} / {maxSize}
            </p>
            <button onClick={pushNumber} disabled={isFull}>
                Push Number {isFull && '(Full)'}
            </button>
            <button onClick={clear}>Clear</button>
            <div>Stack: [{stack.join(', ')}]</div>
        </div>
    )
}
```

## Path Navigation

```tsx
interface Breadcrumb {
    name: string
    path: string
}

function BreadcrumbNavigation() {
    const { stack, push, pop, peek, size } = useStack<Breadcrumb>([
        { name: 'Home', path: '/' },
    ])

    const navigateTo = (breadcrumb: Breadcrumb) => {
        push(breadcrumb)
    }

    const navigateBack = () => {
        if (size > 1) {
            pop()
        }
    }

    const navigateToIndex = (index: number) => {
        while (size > index + 1) {
            pop()
        }
    }

    return (
        <div>
            <nav>
                {stack.map((crumb, index) => (
                    <span key={index}>
                        <button onClick={() => navigateToIndex(index)}>
                            {crumb.name}
                        </button>
                        {index < size - 1 && ' / '}
                    </span>
                ))}
            </nav>

            <button onClick={navigateBack} disabled={size <= 1}>
                ← Back
            </button>

            <div>
                <p>Current: {peek()?.name}</p>
                <button
                    onClick={() =>
                        navigateTo({ name: 'Products', path: '/products' })
                    }
                >
                    Go to Products
                </button>
                <button
                    onClick={() => navigateTo({ name: 'Cart', path: '/cart' })}
                >
                    Go to Cart
                </button>
            </div>
        </div>
    )
}
```

## Modal Stack

```tsx
interface Modal {
    id: string
    component: React.ComponentType
    props?: Record<string, unknown>
}

function ModalStackManager() {
    const { stack, push, pop, peek } = useStack<Modal>()

    const openModal = (modal: Modal) => {
        push(modal)
    }

    const closeModal = () => {
        pop()
    }

    const closeAll = () => {
        stack.clear()
    }

    return (
        <>
            <button
                onClick={() =>
                    openModal({ id: 'settings', component: SettingsModal })
                }
            >
                Open Settings
            </button>

            {stack.map((modal, index) => (
                <div
                    key={modal.id}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000 + index,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <modal.component {...modal.props} onClose={closeModal} />
                </div>
            ))}

            {peek() && <div>Current modal: {peek()!.id}</div>}
        </>
    )
}
```

## State History with Time Travel

```tsx
interface HistoryState<T> {
    data: T
    timestamp: number
    description: string
}

function useStateWithHistory<T>(initialState: T) {
    const history = useStack<HistoryState<T>>()
    const [state, setState] = useState(initialState)

    const updateState = (newState: T, description: string) => {
        history.push({
            data: state,
            timestamp: Date.now(),
            description,
        })
        setState(newState)
    }

    const undo = () => {
        const previous = history.pop()
        if (previous) {
            setState(previous.data)
        }
    }

    return {
        state,
        updateState,
        undo,
        canUndo: !history.isEmpty,
        history: history.stack,
    }
}

function TimeTravelForm() {
    const { state, updateState, undo, canUndo, history } = useStateWithHistory({
        name: '',
        email: '',
    })

    return (
        <div>
            <input
                value={state.name}
                onChange={(e) =>
                    updateState(
                        { ...state, name: e.target.value },
                        'Updated name'
                    )
                }
            />
            <input
                value={state.email}
                onChange={(e) =>
                    updateState(
                        { ...state, email: e.target.value },
                        'Updated email'
                    )
                }
            />

            <button onClick={undo} disabled={!canUndo}>
                Undo
            </button>

            <h4>History:</h4>
            {history.map((item, i) => (
                <div key={i}>
                    {item.description} at{' '}
                    {new Date(item.timestamp).toLocaleTimeString()}
                </div>
            ))}
        </div>
    )
}
```

## Algorithm Visualization

```tsx
function StackSortVisualizer() {
    const mainStack = useStack<number>([5, 2, 8, 1, 9, 3])
    const auxStack = useStack<number>()

    const sortStep = () => {
        if (mainStack.isEmpty) return

        const temp = mainStack.pop()!

        while (!auxStack.isEmpty && auxStack.peek()! > temp) {
            mainStack.push(auxStack.pop()!)
        }

        auxStack.push(temp)
    }

    const sortAll = () => {
        while (!mainStack.isEmpty) {
            sortStep()
        }

        // Move back to main stack
        while (!auxStack.isEmpty) {
            mainStack.push(auxStack.pop()!)
        }
    }

    return (
        <div>
            <button onClick={sortStep}>Sort Step</button>
            <button onClick={sortAll}>Sort All</button>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <h4>Main Stack</h4>
                    {mainStack.stack.map((num, i) => (
                        <div key={i}>{num}</div>
                    ))}
                </div>

                <div>
                    <h4>Auxiliary Stack</h4>
                    {auxStack.stack.map((num, i) => (
                        <div key={i}>{num}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}
```

## API

### Parameters

```typescript
function useStack<T>(initialStack?: T[], maxSize?: number): UseStackReturn<T>
```

#### `initialStack`

-   **Type**: `T[]`
-   **Optional**: Yes
-   **Default**: `[]`
-   **Description**: Initial items in the stack (bottom to top order)

#### `maxSize`

-   **Type**: `number`
-   **Optional**: Yes
-   **Default**: `undefined` (unlimited)
-   **Description**: Maximum number of items the stack can hold. When full, push operations will be rejected with a warning.

### Return Value

```typescript
interface UseStackReturn<T> {
    // State
    stack: T[]
    size: number
    isEmpty: boolean
    isFull: boolean

    // Operations
    push: (item: T) => void
    pop: () => T | undefined
    peek: () => T | undefined
    clear: () => void
    remove: (predicate: (item: T) => boolean) => void
    toArray: () => T[]
}
```

#### State Properties

##### `stack`

-   **Type**: `T[]`
-   **Description**: The current stack items in LIFO order (index 0 is bottom, last index is top)

##### `size`

-   **Type**: `number`
-   **Description**: Number of items in the stack

##### `isEmpty`

-   **Type**: `boolean`
-   **Description**: `true` if the stack has no items

##### `isFull`

-   **Type**: `boolean`
-   **Description**: `true` if the stack has reached maxSize (always `false` if maxSize is not set)

#### Operations

##### `push(item: T): void`

Add an item to the top of the stack. If maxSize is set and stack is full, the operation is rejected with a console warning.

##### `pop(): T | undefined`

Remove and return the top item from the stack. Returns `undefined` if stack is empty.

##### `peek(): T | undefined`

Return the top item without removing it. Returns `undefined` if stack is empty.

##### `clear(): void`

Remove all items from the stack.

##### `remove(predicate: (item: T) => boolean): void`

Remove all items matching the predicate function.

##### `toArray(): T[]`

Return a copy of the stack as an array. Modifying the returned array does not affect the stack.

## Use Cases

-   **Undo/Redo**: Command pattern implementation, editor history
-   **Navigation**: Browser history, breadcrumb navigation
-   **Call Stack**: Function call tracing, recursion visualization
-   **Expression Parsing**: RPN calculators, syntax checking
-   **Modal Management**: Nested modals, overlay stacks
-   **State History**: Time travel debugging, state snapshots
-   **Algorithm Visualization**: Stack-based algorithms (DFS, postfix evaluation)
-   **Backtracking**: Maze solving, puzzle solving

## LIFO vs FIFO

Stack (LIFO - Last-In-First-Out):

-   `push(1), push(2), push(3)` → `pop()` returns `3`
-   Like a stack of plates - last one added is first one removed
-   Use cases: undo/redo, browser back button, function calls

Queue (FIFO - First-In-First-Out):

-   `enqueue(1), enqueue(2), enqueue(3)` → `dequeue()` returns `1`
-   Like a line of people - first one in is first one out
-   Use cases: task processing, message queues, breadth-first search

## TypeScript

The hook is fully typed with TypeScript generics:

```typescript
import {
    useStack,
    UseStackReturn,
    UseStackActions,
} from 'my-awesome-component-library'

// With explicit type
const commandStack: UseStackReturn<Command> = useStack<Command>()

// Type inference
const numberStack = useStack<number>([1, 2, 3])

// With maxSize
const boundedStack = useStack<string>([], 50)
```

## Notes

-   Stack operations maintain LIFO (Last-In-First-Out) order
-   `pop()` returns the actual removed item, not just a status
-   When `maxSize` is set, attempting to push to a full stack logs a warning
-   Initial stack can exceed maxSize, but subsequent pushes will be blocked
-   All operations are type-safe with TypeScript generics
-   `toArray()` returns a copy, preventing accidental mutations
-   Top of stack is at the end of the array (highest index)
