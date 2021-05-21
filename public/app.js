const socket = io('/');
const playSocket = io('/play');
const allBoxs = document.querySelectorAll('.box');
const alert = document.querySelector('.error');
const win = document.querySelector('.win');
let btn = null;

let XorO = 'X';
let XS = [];
let OS = [];
playSocket.on('messListen',(data)=>{
    console.log(data);
})

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

function draw(){
    let over = false;
    allBoxs.forEach((box)=>{
        if(!box.innerHTML){
            over = true;
        }
    });

    return over;
}
function checkWin(XO){
    
    let count = 0;
    let which = null;
    if(XO === 'X'){
        which = XS;
    }else{
        which = OS;
    }

    for(let i=0;i<winCombos.length;i++){
        for(let j=0;j<winCombos[i].length;j++){
            if(which.indexOf(winCombos[i][j]) != -1){
                count++;
            }
        }

        if(count === 3){
            console.log(XO);
            return true;
        }

        count = 0;
    }
 
    return false;
}

function addListeners(){
    allBoxs.forEach((box,i)=>{
        box.addEventListener('click',boxAdd)
    })
}

function clearBoard(){
    allBoxs.forEach((box,i)=>{
        box.innerHTML = null;
    })
}

function resetGame(){
    clearBoard();
    addListeners();
    win.classList.add('d-none');
    btn.removeEventListener('click',resetGame);
}

function removeListener(){
    allBoxs.forEach((box,i)=>{
        box.removeEventListener('click',boxAdd);
    });
}


function close(){
    XS = [];
    OS = [];
 btn.addEventListener('click',resetGame);
}

function boxAdd(e){
    const dataNumber = e.target.getAttribute('data-number') * 1;
    if(!(e.target.innerText === 'X' || e.target.innerText === 'O')){ 
        e.target.innerHTML = `<h1>${XorO}</h1>`;
        playSocket.emit('move',{data:dataNumber})
        let temp = XorO;
        if(XorO==='X'){
            XS.push(dataNumber);
            XorO = 'O'
        }else{
            OS.push(dataNumber);
            XorO = 'X'
        }
        if(checkWin(temp)){
            removeListener()
            
            win.innerText = `${temp} Won the Game`;
            
            win.innerHTML = `
                <div>${temp} Won the Game</div>
                <button class="btn replay">Replay</button>
            `;
            win.classList.remove('d-none');
            btn = document.querySelector('.replay');
            close()
            
        }
        if(!draw()){
            console.log('draw');
            removeListener()
        
            
            win.innerHTML = `
                <div>Draw Game</div>
                <button class="btn replay">Replay</button>
            `;
            win.classList.remove('d-none');
            btn = document.querySelector('.replay');
            close()
        }
    }else{
        alert.classList.remove('d-none');
        setTimeout(()=>{
            alert.classList.add('d-none')
        },1000)
    }

}

addListeners();

