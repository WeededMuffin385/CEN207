import styles from './slide.module.css'

import Architecture from '@/assets/architecture.drawio.svg?react'
import {type ComponentType, type PointerEvent, useEffect, useRef, useState} from "react";
import {ReactTsPopup, RustTokioPopup, PostgresPopup} from "./architecture_showcase_slide/react_ts_popup.tsx";

type ActiveElement = {
    id: string
    anchorX: number
    anchorY: number
}

type PopupComponentProps = {
    close: () => void
}

const popupComponents: Record<string, ComponentType<PopupComponentProps>> = {
    "rust": RustTokioPopup,
    "react": ReactTsPopup,
    "postgres": PostgresPopup,
}

const POPUP_CLOSE_DELAY_MS = 300

export default function BackendShowcaseSlide() {
    const architectureRef = useRef<SVGSVGElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [activeElement, setActiveElement] = useState<ActiveElement | null>(null)
    const PopupComponent = activeElement
        ? popupComponents[activeElement.id]
        : null


    function cancelScheduledClose() {
        if (closeTimerRef.current === null) {
            return
        }

        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
    }

    function scheduleClose() {
        if (closeTimerRef.current !== null) {
            return
        }

        closeTimerRef.current = setTimeout(() => {
            setActiveElement(null)
            closeTimerRef.current = null
        }, POPUP_CLOSE_DELAY_MS)
    }

    function closePopup() {
        cancelScheduledClose()
        setActiveElement(null)
    }

    useEffect(() => {
        return cancelScheduledClose
    }, [])

    useEffect(() => {
        if (activeElement === null) {
            return
        }

        console.log('Новый активный SVG-элемент:', activeElement)
    }, [activeElement])


    function onPointerMove(event: PointerEvent<HTMLDivElement>) {
        const svg = architectureRef.current
        const container = containerRef.current

        if (!svg) {
            throw new Error('Architecture SVG was not found')
        }

        if (!container) {
            throw new Error('Architecture container was not found')
        }

        const elementsUnderPointer = document.elementsFromPoint(
            event.clientX,
            event.clientY,
        )

        const svgElement = findSvgElement(elementsUnderPointer, svg)
        const id = svgElement?.dataset.popup

        if (!svgElement || !id || !popupComponents[id]) {
            scheduleClose()
            return
        }

        cancelScheduledClose()

        if (activeElement?.id === id) {
            return
        }

        const elementRect = svgElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        setActiveElement({
            id,
            anchorX:
                elementRect.left -
                containerRect.left -
                container.clientLeft +
                container.scrollLeft +
                elementRect.width / 2,
            anchorY:
                elementRect.top -
                containerRect.top -
                container.clientTop +
                container.scrollTop +
                elementRect.height / 2,
        })
    }

    return (
        <div
            ref={containerRef}
            className={`${styles.Slide} ${styles.ArchitectureShowcaseSlide}`}
        >
            <h1>Engineering Behind the Experience</h1>

            <div
                className={styles.Architecture}
                onPointerMove={onPointerMove}
                onMouseLeave={() => setActiveElement(null)}
            >
                <Architecture
                    ref={architectureRef}
                    className={styles.ArchitectureSvg}
                />

                {activeElement && PopupComponent && (
                    <div
                        className={styles.Popup}
                        style={{
                            left: activeElement.anchorX,
                            top: activeElement.anchorY
                        }}
                        onPointerEnter={cancelScheduledClose}
                        onPointerLeave={scheduleClose}
                    >
                        <PopupComponent close={closePopup}/>
                    </div>
                )}
            </div>
        </div>
    )
}

function findSvgElement(
    elements: Element[],
    svgRoot: SVGSVGElement,
): SVGGraphicsElement | null {
    for (const element of elements) {
        if (!(element instanceof SVGElement)) {
            continue
        }

        if (!svgRoot.contains(element)) {
            continue
        }

        const marker = element.closest<SVGGraphicsElement>(
            '[data-popup]',
        )

        if (marker && svgRoot.contains(marker)) {
            return marker
        }
    }

    return null
}