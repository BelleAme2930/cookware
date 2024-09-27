import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const TextArea = forwardRef(function TextArea(
    { className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            className={
                'rounded-sm border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ' +
                className
            }
            ref={localRef}
        />
    );
});

export default TextArea;
