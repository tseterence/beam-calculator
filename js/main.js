document.querySelector('#clear').addEventListener('click', clear)
document.querySelector('#calculate').addEventListener('click', calculate)

function clear() {
    Array.from(document.querySelectorAll('input')).forEach(input => input.value = '')
    document.querySelector('.outputs').style.display = 'none'
}

function calculate() {
    if (validate()) {
        calcRxn()
        calcX()
        calcMax()
        document.querySelector('.outputs').style.display = 'block'
        console.log('calculated')
    }
}

function validate() {
    console.log('validating input...')
    
    let l = document.querySelector('#length').value
    let w = document.querySelector('#load').value
    let E = document.querySelector('#youngsModulus').value
    let I = document.querySelector('#momentInertia').value
    let x = document.querySelector('#pointX').value

    if (isNaN(Number(l)) || Number(l) <= 0) {
        alert('L must have a value greater than 0.')
        return false
    }
    if (w === '' || isNaN(Number(w))) {
        alert('Please enter an acceptable value for w.')
        return false
    }
    if (isNaN(Number(E)) || Number(E) <= 0) {
        alert('E must have a value greater than 0.')
        return false
    }
    if (isNaN(Number(I)) || Number(I) <= 0) {
        alert('I must have a value greater than 0.')
        return false
    }
    if (isNaN(Number(x)) || Number(x) <= 0 || Number(x) > l) {
        alert('x must be a value between 0 and L.')
        return false
    }
    return true
}

function calcRxn() {
    let l = document.querySelector('#length').value
    let w = document.querySelector('#load').value

    let Equiv = w * l
    document.querySelector('#equiv').innerHTML = `${Equiv.toFixed(1)} kips`

    let Rxn = w * l / 2
    document.querySelector('#rxn').innerHTML = `${Rxn.toFixed(1)} kips`
}

function calcX() {
    let l = document.querySelector('#length').value
    let w = document.querySelector('#load').value
    let E = document.querySelector('#youngsModulus').value
    let I = document.querySelector('#momentInertia').value
    let x = document.querySelector('#pointX').value

    let Vx = w * (l / 2 - x)
    document.querySelector('#shearX').innerHTML = `${Vx.toFixed(2)} kips`

    let Mx = w * x / 2 * (l - x)
    document.querySelector('#momentX').innerHTML = `${Mx.toFixed(1)} kip-in`

    let Dx = (w * x) / (24 * E * I) * (l ** 3 - 2 * l * x ** 2 + x ** 3)
    document.querySelector('#deflectionX').innerHTML = `${Dx.toFixed(4)} in`
}

function calcMax() {
    let l = document.querySelector('#length').value
    let w = document.querySelector('#load').value
    let E = document.querySelector('#youngsModulus').value
    let I = document.querySelector('#momentInertia').value

    let Mmax = w * (l ** 2) / 8
    document.querySelector('#momentMax').innerHTML = `${Mmax.toFixed(1)} kip-in`

    let Dmax = (5 * w * l ** 4) / (384 * E * I)
    document.querySelector('#deflectionMax').innerHTML = `${Dmax.toFixed(4)} in`
}