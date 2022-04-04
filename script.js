const button = document.getElementById('addBar');
const barContainer = document.getElementById('allBars');

const addProgressBar = function() {
    const container = document.createElement('div');
    container.classList.add('bar-container');

    const status = document.createElement('div');
    status.classList.add('status');
    status.style.width = '0%';

    container.appendChild(status);
    barContainer.appendChild(container);

    return status;
}

const maxActive = 3;
const queue = [];
let isRunning = false;

function updateProgressBar(elem) {
    return new Promise(( resolve, reject ) => {
        let interval = setInterval(() => {
            let width = parseInt(elem.style.width);

            if (width < 100) {
                width++;
                elem.style.width = `${width}%`;
            } else {
                queue.shift();
                clearInterval(interval);
                resolve();
            }
        }, 30);
    });
}

function throttle() {
    let i = 0;

    function doNext() {
        const nextStatus = document.querySelector('.status:not(.active)');
        if (nextStatus) {
            nextStatus.classList.add('active');

            return updateProgressBar(nextStatus).then(() => {
                return doNext();
            })
        }
    }

    if (queue.length <= maxActive) {
        doNext();
    }
}

button.addEventListener('click', () => {
    queue.push(addProgressBar());
    throttle();
})