import React, { ReactNode, CSSProperties } from 'react'
import { classNames } from '../../utility/classnames'
import './Form.scss'

export type FormActionsAlign = 'left' | 'right' | 'center' | 'space-between'

export type FormActionsProps = {
    /**
     * Button elements
     */
    children: ReactNode
    /**
     * Alignment of buttons
     * @default 'right'
     */
    align?: FormActionsAlign
    /**
     * Additional className
     */
    className?: string
    /**
     * Additional inline styles
     */
    style?: CSSProperties
}

/**
 * FormActions component for form button groups.
 *
 * @example
 * ```tsx
 * <FormActions align="right">
 *   <Button variant="outline" onClick={onCancel}>Cancel</Button>
 *   <Button type="submit">Submit</Button>
 * </FormActions>
 * ```
 */
export const FormActions: React.FC<FormActionsProps> = ({
    children,
    align = 'right',
    className,
    style,
}) => {
    const actionsClassName = classNames(
        'form-actions',
        `form-actions--${align}`,
        className
    )

    return (
        <div className={actionsClassName} style={style}>
            {children}
        </div>
    )
}

export default FormActions
