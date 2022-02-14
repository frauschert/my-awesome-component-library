const isTouchEvent = (event: Event): event is TouchEvent => {
    return 'touches' in event
}

export default isTouchEvent
