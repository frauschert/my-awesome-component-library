import React from 'react'
import { render } from '@testing-library/react'
import Portal from './Portal'

const wrapperId = 'test-wrapper'

test('should create a div element with the provided wrapperId and append it to the document body', () => {
    render(
        <Portal wrapperId={wrapperId}>
            <p>Test</p>
        </Portal>
    )

    const wrapperElement = document.getElementById(wrapperId)
    expect(wrapperElement).toBeInTheDocument()
})

test('should delete the programatically created div element from the document body when unmounted', () => {
    const { unmount } = render(
        <Portal wrapperId={wrapperId}>
            <p>Test</p>
        </Portal>
    )

    const wrapperElement = document.getElementById(wrapperId)
    expect(wrapperElement).toBeInTheDocument()

    // simulate component unmount
    unmount()

    const updatedWrapperElement = document.getElementById(wrapperId)
    expect(updatedWrapperElement).not.toBeInTheDocument()
})

test('should render the children inside the portal with the provided wrapper div element', () => {
    const testText = 'Test Text'
    render(
        <Portal wrapperId={wrapperId}>
            <p>{testText}</p>
        </Portal>
    )

    const portalContainer = document.querySelector(`#${wrapperId} > p`)
    expect(portalContainer?.textContent).toEqual(testText)
})
