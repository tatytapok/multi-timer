 const audio = document.querySelector('audio')
        audio.volume = 0.1;
const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand')
const hoursHand = document.querySelector('.hour-hand')
const stopwatchButton = document.querySelector('.stopwatch-start')
const timerButton = document.querySelector('.timer-start')
const stopwatchDisplay = document.querySelector('.stopwatch-display')
let interval = null
let isRuning = false
let startTime =0
let progress =0
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

function reset(){
    isRuning= false

    clearInterval(interval)
    interval=null

    stopwatchDisplay.textContent= '00:00:00'
    stopwatchButton.textContent ='Start'

    progress =0
}
stopwatchButton.addEventListener('click',() =>{
    if(!isRuning){ 
        isRuning =true
        stopwatchButton.textContent ='Stop'
        setStopwatch() 
        stopwatchProgress()
    }else{
         reset()
    }
})

timerButton.addEventListener('click',setTimer)