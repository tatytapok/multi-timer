 const audio = document.querySelector('audio')
        audio.volume = 0.1;
        const secondHand = document.querySelector('.second-hand');
        const minsHand = document.querySelector('.min-hand')
        const hoursHand = document.querySelector('.hour-hand')


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
            const hoursDegrees = ((hours / 12) * 360) + ((minutes/60)*30)+ 90;
            hoursHand.style.transform = `rotate(${hoursDegrees}deg)`;
        }

        setInterval(setDate, 1000);

        setDate();