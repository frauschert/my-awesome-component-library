export default function isTouchEvent(event: Event): event is TouchEvent {
    return 'touches' in event
}
