import Card from './Card';
import type {CardProps} from "./type"
import React, {useRef, useState, useEffect} from "react";


export default function CardWrapper({list}: {list: CardProps[]}) {
    const baseDistance = 19;
    const rootFontSize = 16;
    const cardsRef = useRef<HTMLDivElement>(null);
    const initialClienX = useRef<number>(0);
    const cardsArray = useRef<HTMLCollection>();
    const cardsLength = useRef<number>(list.length);
    const [current, setCurrentIndex] = useState<number>(0);
    const currentRef = useRef<number>(0);
    const prev = useRef<number>(1);
    const next = useRef<number>(1);
    const prevTranslateX = useRef<number>(-baseDistance);
    const nextTranslateX = useRef<number>(baseDistance);
    const intervalId = useRef<ReturnType<typeof setInterval>>();
    const direction = useRef<number>(1);
    const manualDistance = useRef<number>(0);

    function startTransition() {
        // if(initialClienX.current === 0) return;

        (cardsArray.current![prev.current] as HTMLElement).style.transition = '';
        (cardsArray.current![next.current] as HTMLElement).style.transition = '';
        (cardsArray.current![currentRef.current] as HTMLElement).style.transition = '';
    }

    function lessThanTwo() {
        return list.length <= 1;
    }
    function stopTransition() {
        console.log('stopTransition: ');
        (cardsArray.current![prev.current] as HTMLElement).style.transition = 'none';
        (cardsArray.current![next.current] as HTMLElement).style.transition = 'none';
        (cardsArray.current![currentRef.current] as HTMLElement).style.transition = 'none';
    }
    function setAnimation() {
        if (lessThanTwo()) return;
        prev.current= (currentRef.current - 1 + cardsLength.current) % cardsLength.current;
        next.current =( currentRef.current + 1 + cardsLength.current ) % cardsLength.current;
        // direction > 0: 往左滑； direction < 0: 往右滑
        const prevRunNumber = 3;
        const nextRunNumber = 1;
        const prevCutNumber = direction.current > 0 ? nextRunNumber : prevRunNumber;
        const nextCutNumber = direction.current < 0 ? nextRunNumber : prevRunNumber;
        (cardsArray.current![prev.current] as HTMLElement).style.zIndex = cardsLength.current - prevCutNumber + '';
        (cardsArray.current![prev.current] as HTMLElement).style.transform = `translateX(${prevTranslateX.current}rem)`;
        (cardsArray.current![currentRef.current] as HTMLElement).style.zIndex = cardsLength.current + '';
        (cardsArray.current![currentRef.current] as HTMLElement).style.transform = `translateX(${ manualDistance.current}rem)`;
        (cardsArray.current![next.current] as HTMLElement).style.zIndex = cardsLength.current - nextCutNumber + '';
        (cardsArray.current![next.current] as HTMLElement).style.transform = `translateX(${nextTranslateX.current}rem)`;
    }
    function RAF(callback: () => void) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => callback())
        })
    }
    function initAnimation() {
        if (lessThanTwo()) return;
        clearInterval(intervalId.current);
        RAF(() =>direction.current = 1);

        intervalId.current = setInterval(() => {
            setCurrentIndex(current => (current + direction.current +  cardsLength.current) % cardsLength.current);
        }, 2000)
    }
    useEffect(() => {
        RAF(setAnimation);
        currentRef.current = current;
    }, [current]);

    useEffect(() => {
        cardsArray.current = cardsRef.current!.children;
        setAnimation();
        document.documentElement.addEventListener('mouseup', handleDocumentMouseUp);
        initAnimation();

        return () => {
            document.documentElement.removeEventListener('mouseup', handleDocumentMouseUp);
        }
    }, [])

    function handleDocumentMouseUp(event: MouseEvent) {
        cardsRef.current?.removeEventListener('mousemove', handleMouseMove);

        if (!initialClienX.current ||  lessThanTwo()) return;
        manualToAuto();
        
        event.preventDefault();
        event.stopPropagation();
    }

    function manualToAuto() {
        startTransition();

        if (Math.abs(manualDistance.current) > 3) {

            setCurrentIndex(current => {
                return (current + direction.current +  cardsLength.current) % cardsLength.current
            });
            // reset distance anytime
            resetDistance();
        } else {
            // not move，reset distance before animation
            resetDistance();
            RAF(setAnimation);
        }
        initAnimation();
    }
    function resetDistance() {
        prevTranslateX.current = -baseDistance;
        nextTranslateX.current = baseDistance;
        manualDistance.current = 0;
        initialClienX.current = 0;
    }


    function handleMouseMove(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        if (!initialClienX.current) return;
        const distance = event.clientX - initialClienX.current;
        manualDistance.current = +(distance/rootFontSize).toFixed(2);
        prevTranslateX.current = -baseDistance + manualDistance.current;
        nextTranslateX.current = baseDistance + manualDistance.current;
        direction.current = manualDistance.current < 0 ? 1 : -1;

        RAF(setAnimation);
    }
    function handleMouseDown(event: React.MouseEvent) {
        clearInterval(intervalId.current);
        initialClienX.current = event.clientX;
        stopTransition();
        cardsRef.current?.addEventListener('mousemove', handleMouseMove);
        event.stopPropagation();
        event.preventDefault();

    }
    function handleMouseUp(event:React.MouseEvent) {
        event.stopPropagation();
        cardsRef.current?.removeEventListener('mousemove', handleMouseMove);

        if (Math.abs(manualDistance.current) < 1) return;
        manualToAuto();
    }
    function handleMouseLeave(event:React.MouseEvent) {
        event.stopPropagation();
    }
  return (
    <>
        <section
            className="home-cards--wrapper"
            ref={cardsRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            // onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {list.map(l => {
                return   <Card textareaValue={l.textareaValue} info={l.basic} query={l.query} key={l.id}/>;
            })}
        </section>
         <p className="home-cards--page">{current + 1} / {list.length}</p>
    </>
  )
}