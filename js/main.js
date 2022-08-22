// suggestions:
// multiple load cases/support conditions
// add dropdown <select> tag to select steel beam Ixx based off library

document.querySelector('#calculate').addEventListener('click', calculate)
document.querySelectorAll('.outputUnit').forEach(item => item.addEventListener('change', updateOutput))
document.querySelector('#clear').addEventListener('click', clearInput)
document.querySelectorAll('input').forEach(item => item.addEventListener('change', hideOutput))
document.querySelectorAll('.inputUnit').forEach(item => item.addEventListener('change', hideOutput))

// calculate driver function
function calculate(e) {
    storeInput()
    if (validateInput()) {
        updateOutput()
        document.querySelector('.outputs').style.display = 'block'
        document.querySelector('.outputs').scrollIntoView()
    }
    // console.log(e.composedPath())
}

// global namespace storing all user input
let inputValues = {}

// [kip] & [ft] units by default, number type
function storeInput() {
    if (document.querySelector('#L_unit').value === 'ft') {
        inputValues.l = document.querySelector('#length').value / 1
    } else if (document.querySelector('#L_unit').value === 'in') {
        inputValues.l = document.querySelector('#length').value / 12
    }

    if (document.querySelector('#w_unit').value === 'plf') {
        inputValues.w = document.querySelector('#load').value / 1000
    } else if (document.querySelector('#w_unit').value === 'klf') {
        inputValues.w = document.querySelector('#load').value / 1
    } else if (document.querySelector('#w_unit').value === 'pli') {
        inputValues.w = document.querySelector('#load').value / 1000 * 12
    }

    if (document.querySelector('#x_unit').value === 'ft') {
        inputValues.x = document.querySelector('#pointX').value / 1
    } else if (document.querySelector('#x_unit').value === 'in') {
        inputValues.x = document.querySelector('#pointX').value / 12
    }

    inputValues.E = document.querySelector('#youngsModulus').value * (12 ** 2)
    inputValues.I = document.querySelector('#momentInertia').value / (12 ** 4)
}

// validate inputs
function validateInput() {
    if (isNaN(inputValues.l) || inputValues.l <= 0) {
        alert('L must have a value greater than 0.')
        return false
    }
    if (inputValues.w === '' || isNaN(inputValues.w)) {
        alert('Please enter an acceptable value for w.')
        return false
    }
    if (isNaN(inputValues.E) || inputValues.E <= 0) {
        alert('E must have a value greater than 0.')
        return false
    }
    if (isNaN(inputValues.I) || inputValues.I <= 0) {
        alert('I must have a value greater than 0.')
        return false
    }
    // x should not be required to det max. shear, moment, and deflection
    if (isNaN(inputValues.x) || inputValues.x <= 0 || inputValues.x > inputValues.l) {
        alert('x must be a value between 0 and L.')
        return false
    }
    return true
}

// global namespace storing all output
let outputValues = {}

// [kip] & [ft] units by default, number type
function calcOutput() {
    outputValues.R = inputValues.w * inputValues.l / 2
    outputValues.Vx = inputValues.w * (inputValues.l / 2 - inputValues.x)
    outputValues.Mmax = inputValues.w * (inputValues.l ** 2) / 8
    outputValues.Mx = inputValues.w * inputValues.x / 2 * (inputValues.l - inputValues.x)
    outputValues.Dmax = (5 * inputValues.w * inputValues.l ** 4) / (384 * inputValues.E * inputValues.I)
    outputValues.Dx = (inputValues.w * inputValues.x) / (24 * inputValues.E * inputValues.I) * ((inputValues.l ** 3 - 2 * inputValues.l * inputValues.x ** 2 + inputValues.x ** 3))
}

// display output
function displayOutput() {
    if (document.querySelector('#R_unit').value === 'kip') {
        document.querySelector('#rxn').innerHTML = `${(outputValues.R).toFixed(2)}`
    } else if (document.querySelector('#R_unit').value === 'lbf') {
        document.querySelector('#rxn').innerHTML = `${(outputValues.R * 1000).toFixed(0)}`
    }

    if (document.querySelector('#Vx_unit').value === 'kip') {
        document.querySelector('#shearX').innerHTML = `${(outputValues.Vx).toFixed(2)}`
    } else if (document.querySelector('#Vx_unit').value === 'lbf') {
        document.querySelector('#shearX').innerHTML = `${(outputValues.Vx * 1000).toFixed(0)}`
    }

    if (document.querySelector('#Mmax_unit').value === 'kip-ft') {
        document.querySelector('#momentMax').innerHTML = `${(outputValues.Mmax).toFixed(2)}`
    } else if (document.querySelector('#Mmax_unit').value === 'lbf-ft') {
        document.querySelector('#momentMax').innerHTML = `${(outputValues.Mmax * 1000).toFixed(0)}`
    } else if (document.querySelector('#Mmax_unit').value === 'lbf-in') {
        document.querySelector('#momentMax').innerHTML = `${(outputValues.Mmax * 1000 * 12).toFixed(0)}`
    }

    if (document.querySelector('#Mx_unit').value === 'kip-ft') {
        document.querySelector('#momentX').innerHTML = `${(outputValues.Mx).toFixed(2)}`
    } else if (document.querySelector('#Mx_unit').value === 'lbf-ft') {
        document.querySelector('#momentX').innerHTML = `${(outputValues.Mx * 1000).toFixed(0)}`
    } else if (document.querySelector('#Mx_unit').value === 'lbf-in') {
        document.querySelector('#momentX').innerHTML = `${(outputValues.Mx * 1000 * 12).toFixed(0)}`
    }

    if (document.querySelector('#Dmax_unit').value === 'in') {
        document.querySelector('#deflectionMax').innerHTML = `${(outputValues.Dmax * 12).toFixed(4)}`
    } else if (document.querySelector('#Dmax_unit').value === 'ft') {
        document.querySelector('#deflectionMax').innerHTML = `${(outputValues.Dmax).toFixed(4)}`
    }

    if (document.querySelector('#Dx_unit').value === 'in') {
        document.querySelector('#deflectionX').innerHTML = `${(outputValues.Dx * 12).toFixed(4)}`
    } else if (document.querySelector('#Dx_unit').value === 'ft') {
        document.querySelector('#deflectionX').innerHTML = `${(outputValues.Dx).toFixed(4)}`
    }
}

function updateOutput(e) {
    calcOutput()
    displayOutput()

    // console.log(e.target)
    // console.log(e.target.value)
    // console.log(e.target.id)
}

function hideOutput() {
    document.querySelector('.outputs').style.display = 'none'
}

function clearInput() {
    hideOutput()
    document.querySelectorAll('input').forEach(input => input.value = input.defaultValue)
    document.querySelectorAll('.inputUnit').forEach(input => input.selectedIndex = 0)
}