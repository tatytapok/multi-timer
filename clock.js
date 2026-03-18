 const audio = document.querySelector('audio')
        audio.volume = 0.1;
let secondHand = document.querySelector('.second-hand');
let minsHand = document.querySelector('.min-hand')
let hoursHand = document.querySelector('.hour-hand')
const stopwatchButton = document.querySelector('.stopwatch-start')
const timerButton = document.querySelector('.timer-start')
const stopwatchDisplay = document.querySelector('.stopwatch-display')
const timerDisplay = document.querySelector('.timer-display')
const clockFace = document.querySelector('.clock-face')
let interval = null
let isRuning = false
let startTime =0
let progress =0
let analogTime= null
let isAnalogMode = true // по умолчанию аналоговые часы

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

    audio.currentTime = 0;
    audio.play();

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

    console.log('this is future')
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



function updateDisplay(ms){
    console.log('display')
    const totalSeconds = Math.floor(ms/1000)
    //padstart строка всегда будет иметь заданную длину
    //даже если чисто однозначное в начале приконкатенируется 0 
    const hours = String(Math.floor(totalSeconds/ 3600)).padStart(2,'0')
    const minuets = String(Math.floor((totalSeconds% 3600)/60)).padStart(2,'0')
    const seconds = String(totalSeconds% 60).padStart(2,'0')
    stopwatchDisplay.textContent = `${hours}:${minuets}:${seconds}`
}

function setTimer(){
    console.log("timer")

}
function timerProgress(){
    console.log("progress")
}
function setStopwatch(){
        startTime = Date.now()

        interval = setInterval(()=>{
        const elapsed = Date.now() - startTime
        updateDisplay(elapsed)
    }, 1000)
}

function stopwatchProgress(){
    console.log('Stopwatchprogress')

}

function reset(display, button){
    isRuning= false

    clearInterval(interval)
    interval=null

    display.textContent= '00:00:00'
    button.textContent ='Start'

    progress =0
}
stopwatchButton.addEventListener('click',() =>{
    if(!isRuning){ 
        isRuning =true
        stopwatchButton.textContent ='Stop'
        setStopwatch() 
        stopwatchProgress()
    }else{
         reset(stopwatchDisplay, stopwatchButton)
    }
})

timerButton.addEventListener('click',()=>{
    if(!isRuning){
        isRuning =true
        timerButton.textContent = 'Stop'
        setTimer()
        timerProgress()
    }else{
        reset(timerDisplay, timerButton)
    }
})

clockFace.addEventListener('click', modernClock)