// const audio = document.querySelector('audio')
//        audio.volume = 0.1;
let secondHand = document.querySelector('.second-hand');
let minsHand = document.querySelector('.min-hand')
let hoursHand = document.querySelector('.hour-hand')
const stopwatchButton = document.querySelector('.stopwatch-start')
const timerButton = document.querySelector('.timer-start')
const stopwatchDisplay = document.querySelector('.stopwatch-display')
const timerDisplay = document.querySelector('.timer-display')
const clockFace = document.querySelector('.clock-face')
const addStopwatch = document.querySelector('.add-stopwatch')
const stopwatchDisplayes = document.querySelector('.stopwatch-displayes')
let stopwatches = []
let isRuning = false
let progress =0
let analogTime= null
let isAnalogMode = true // по умолчанию аналоговые часы


// CLOCK DIGITAL ANGANALOG

function startAnalogClock(){
    if(analogTime)clearInterval(analogTime)
        analogTime= setInterval(setDate, 1000)
        setDate()

}

function stopAnalogClock(){
    if (analogTime){
        clearInterval(analogTime)
        analogTime = null
    }
}

startAnalogClock()

function setDate(){
    const now = new Date();

    const seconds = now.getSeconds();
    const secondsDegrees = ((seconds / 60) * 360) + 90;

//чтобы не было резкого перехода при 0 секундах, убираем transition, а при остальных секундах добавляем его обратно
    if (seconds === 0) {
        secondHand.style.transition = "none";
    } else {
            secondHand.style.transition = "all 0.05s cubic-bezier(0.1, 2.7, 0.58, 1)";
    }


    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

    //audio.currentTime = 0;
   // audio.play();

    const minutes = now.getMinutes();
    const minutesDegrees = ((minutes / 60) * 360) + 90;
    minsHand.style.transform = `rotate(${minutesDegrees}deg)`;

    const hours = now.getHours();
    //учитываем 12-ти часовой формат для часовой стрелки
    const hoursIn12Format = hours % 12
    const hoursDegrees = ((hoursIn12Format / 12) * 360) + ((minutes/60)*30)+ 90;
    hoursHand.style.transform = `rotate(${hoursDegrees}deg)`;
}

setInterval(setDate, 1000);

setDate();
let isDigitalMode = false
let digitalTime = null

function modernClock(){
    if(!isDigitalMode){
        // сохраняем html кконтент для  clock-face 
        if(!clockFace.hasAttribute('data-original-content')){
            clockFace.setAttribute('data-original-content', clockFace.innerHTML)
        }

        //stop analog clock

        stopAnalogClock()



    //контейнер для диджитал циферблата 
    const digitalContent = document.createElement('div')
    digitalContent.className = 'digital-content'

    //дисплей 
    const clockDisplay = document.createElement('div')
    clockDisplay.className= 'display clock-display'

    //clock name
    const clockName = document.createElement('div')
    clockName.className = 'clock-name name glass'
    clockName.innerHTML= 'Clock'

    // доб. эл-ты в контейнер 
    digitalContent.appendChild(clockDisplay)
    digitalContent.appendChild(clockName)

    clockFace.innerHTML = '';
    clockFace.appendChild(digitalContent)

    setDigitalClock(clockDisplay)
    digitalTime = setInterval(()=> setDigitalClock(clockDisplay),1000)

    isDigitalMode = true
    } else{

        if(digitalTime){
            clearInterval(digitalTime)
            digitalTime = null
        }



        //возвращ. содержимоет ориг. 
        const originalContent = clockFace.getAttribute('data-original-content')
        if (originalContent){
            clockFace.innerHTML = originalContent

            secondHand = document.querySelector('.second-hand');
            minsHand = document.querySelector('.min-hand');
            hoursHand = document.querySelector('.hour-hand');

        }

        startAnalogClock()

        isDigitalMode = false
    }
}

function setDigitalClock(displayElement){
    const now = new Date()
    const hours = String(now.getHours()).padStart(2,'0')
    const minutes = String(now.getMinutes()).padStart(2,'0')
    const seconds = String(now.getSeconds()).padStart(2,'0')

    displayElement.textContent = `${hours}:${minutes}:${seconds}`
}

clockFace.addEventListener('click', modernClock)


// DISPLAY CHANGING FORSTOPWATCH AND TIMER

function formateTime(ms){
    const totalSeconds = Math.floor(ms/1000)
    //padstart строка всегда будет иметь заданную длину
    //даже если чисто однозначное в начале приконкатенируется 0 
    const hours = String(Math.floor(totalSeconds/ 3600)).padStart(2,'0')
    const minuets = String(Math.floor((totalSeconds% 3600)/60)).padStart(2,'0')
    const seconds = String(totalSeconds% 60).padStart(2,'0')
    return`${hours}:${minuets}:${seconds}`
}

function updateDisplay(element,ms){
    element.textContent = formateTime(ms)

}

// TIMER FUNCTIONAL
//create timewheel функционал для красивого перетягивания значений таймера 
function initTimeWheel(){
    const hoursEl = document.querySelector('#hours')
    const minutesEl = document.querySelector('#minutes')
    const secondsEl = document.querySelector('#seconds')
    
    let activeSegment = null
    let startY = 0;

    let isDragging = false;

    //timer value 
    const values= {
        hours: 0,
        minutes: 0,
        seconds:0
    }

    function updateDisplay(segment, value){
        const formattedValue = value.toString().padStart(2,'0')
        document.getElementById(segment).textContent= formattedValue
    }
    
    //calculate new values
    function calculateNewValue(segment, delta){
        const limits ={
            hours:{max: 23},
            minutes:{max: 59},
            seconds:{max: 59}
        }

        // to infinity value cicle 
        const limit = limits[segment].max +1
        
        let currentValue = values[segment]

        let newValue = (currentValue + delta)% limit
        
        //if value <0
        if (newValue < 0){
            newValue +=limit
        }

        return newValue
    }

    function startDrag(e, segmentId){
        // preventDefault() метод отменяет только физическое действие браузера — 
        // переход, отправку, прокрутку, — но не останавливает само событие.
        e.preventDefault()
        activeSegment = segmentId
        startY = e.clientY
       
        isDragging = true 
        document.getElementById(segmentId).classList.add('active')

    }

    let accumulateDelta = 0
    const stepSize =100
    let lastUpdate = 0
    const delay = 50 // мс

    function onDrag(e){
        const now = Date.now()
        if (now - lastUpdate < delay) return
        lastUpdate = now
        if(!isDragging || !activeSegment) return

        e.preventDefault()

        const deltaY = startY - e.clientY
        accumulateDelta +=deltaY
        let steps = Math.floor(accumulateDelta / stepSize)

        steps = Math.sign(steps) * Math.floor(Math.abs(steps) ** 0.8)

        if (Math.abs(steps) > 1) {
        steps = Math.sign(steps)
}

        if (steps!== 0){
            const newValue = calculateNewValue(activeSegment, steps)
            values[activeSegment] = newValue
            updateDisplay(activeSegment, newValue)


            accumulateDelta = steps * stepSize
        }
        startY= e.clientY
    }

    function stopDrag(){
        if (isDragging){
            document.getElementById(activeSegment)?.classList.remove('active')
            isDragging = false 
            activeSegment = null
        }
    }


    [hoursEl, minutesEl, secondsEl].forEach(el=>{
        el.addEventListener('mousedown', (e)=> startDrag(e, el.id))
    })

    document.addEventListener('mousemove',onDrag)
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('mouseleave',stopDrag)


    document.addEventListener('dragstart', (e)=>e.preventDefault())
    console.log(values)
}

document.addEventListener('DOMContentLoaded',initTimeWheel)

function setTimer(){
    console.log("timer")

}
function timerProgress(){
    console.log("progress")
}


function createTimer(displayElement){
        let interval = null
        let startTime = 0

        return{
            start(){
                startTime = Date.now()

                interval = setInterval(()=>{
                const elapsed = Date.now() - startTime
                updateDisplay(displayElement,elapsed)
            }, 100)
            },

            stop(){
                clearInterval(interval)
            },

            reset(){
                clearInterval(interval)
                displayElement.textContent= '00:00:00'

            },

            destroy(){
                this.stop()
                displayElement.remove()
            }
        }       
}


timerButton.addEventListener('click',()=>{
    if(!isRuning){
        isRuning =true
        
        setTimer()
        timerProgress()
    }else{
        reset(timerDisplay, timerButton)
    }
})


//STOPWATCH FUNCTIONAL

function createStopwatch(displayElement){
        let interval = null
        let startTime = 0

        return{
            start(){
                startTime = Date.now()

                interval = setInterval(()=>{
                const elapsed = Date.now() - startTime
                updateDisplay(displayElement,elapsed)
            }, 100)
            },

            stop(){
                clearInterval(interval)
            },

            reset(){
                clearInterval(interval)
                displayElement.textContent= '00:00:00'

            },

            destroy(){
                this.stop()
                displayElement.remove()
            }
        }       
}

function stopwatchProgress(){
    console.log('Stopwatchprogress')

}

let mainStopwatch = createStopwatch(stopwatchDisplay)
stopwatches.push(mainStopwatch)

stopwatchButton.addEventListener('click',() =>{
    if(!isRuning){ 
        isRuning =true
        stopwatchButton.textContent ='Stop'
        mainStopwatch.start()
    }
    
    else{
        isRuning = false
        stopwatchButton.textContent = 'Start'
        mainStopwatch.reset()

        stopwatches
            .filter(sw => sw !== mainStopwatch)
            .forEach(sw => sw.destroy())

        
    }
})


function addStopwatchDisplay(){
    const nextDisplay = document.createElement('div')
    nextDisplay.className = 'display stopwatch-display next-stopwatch-display'
    stopwatchDisplayes.appendChild(nextDisplay)

    //add stopwatch
    const stopwatch = createStopwatch(nextDisplay)

    stopwatches.push(stopwatch)

    stopwatch.start()

        
    function removeStopwatch(){
        stopwatch.destroy()
        // удаляем из массива
        stopwatches = stopwatches.filter(sw => sw !== stopwatch)
}

    nextDisplay.addEventListener('click', () =>{
        removeStopwatch(stopwatch)
    })

    return stopwatch

}

stopwatchDisplay.addEventListener('click',  () =>{
    mainStopwatch.reset()
})



addStopwatch.addEventListener('click', ()=>{
    if(!isRuning){ 
        isRuning =true
        stopwatchButton.textContent ='Stop'
        mainStopwatch.start()
    }else{
        addStopwatchDisplay()
    }
    })
