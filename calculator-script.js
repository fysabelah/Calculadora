function addListenerOnButtons() {
    let buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        let buttonTextValue = button.textContent;

        if (buttonTextValue == '='){
            button.addEventListener('click', () => getResult());
        } else {
            button.addEventListener('click', () => putValueOnDisplay(buttonTextValue));
        }
    });
}

function getResult() {
    let display = document.querySelector('.display');
    let expression = display.textContent ? display.textContent : '';

    if (expression.length > 0) {
        expression = normalizeExpression(expression);

        value = () => {
            try {
                console.log(expression);

                return new Function('return ' + expression)();
            } catch (error) {
                alert('Não foi possível realizar cálculo! Verifique a expressão!');
            }
        }

        const result = value();
        
        display.innerHTML = result % 1 === 0 ? result : result.toFixed(4);
    }
}

function normalizeExpression(expression) {
    let operators = ['√', '%', '×', '÷', '-', '+'];

    expression = expression.replaceAll('×', '*').replaceAll('÷', '/');

    const tokens = expression.match(/(\d+(\.\d+)?|\D)/g);

    let sqrtIndex = tokens.indexOf('√');
    while(sqrtIndex != -1) {
        tokens[sqrtIndex] = 'Math.sqrt(';
    
        for (let i = sqrtIndex + 1; i < tokens.length; i ++) {
            if (!operators.includes(tokens[i])) {
                tokens[i] += ')';
                break;
            }
        }

        sqrtIndex = tokens.indexOf('√');
    }

    return tokens.join(" ");
}

function putValueOnDisplay(textContent) {
    let display = document.querySelector('.display');
    let expression = display.textContent ? display.textContent : '';
    let operators = ['√', '%', '×', '÷', '-', '+'];
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let clear = ["C", "CE"];
    
    if (clear.includes(textContent)) {
        clearOrDeleteLastCaracter(textContent, display, expression);
    } else {
        if (expression.length == 0 && !numbers.includes(textContent) && textContent != '√') {
            alert('A expressão deve começar com um número ou raiz quadrada!');
        } else if (expression.length >= 8) {
            alert('O tamanho máximo para expressão é de 8 caracteres!');
        } else if (textContent == '.') {
            addDotToExpression(expression, display, operators);
        } else if (numbers.includes(textContent)) {
            addNumberToExpression(textContent, display, expression);
        } else if (operators.includes(textContent)) {
            addOperatorToExpression(textContent, expression, display, operators);
        }
    }
}

function addDotToExpression(expression, displaySelector, operators) {
    const tokens = expression.match(/(\d+(\.\d+)?|\D)/g);
    const lastValueOnExpression = tokens[tokens.length - 1];

    if (!operators.includes(lastValueOnExpression) && expression.length <= 6 && lastValueOnExpression.search('\\.') == -1) {
        displaySelector.textContent += '.';
    } else {
        alert('O . só pode ser adicionado após um número e em expressão de no máximo 6 caracteres!');
    }
}

function addNumberToExpression(textContent, displaySelector, expression){
    let lastValueOnExpression = expression[expression.length - 1];

    if (lastValueOnExpression == '%') {
        alert('Após % deve haver outra operação!');
    } else {
        displaySelector.textContent += textContent;
    }
}

function clearOrDeleteLastCaracter(textContent, displaySelector, expression) {
    if (textContent == 'CE') {
        displaySelector.textContent = expression.substring(0, expression.length - 1);
    } else {
        displaySelector.textContent = ''
    }
}

function addOperatorToExpression(textContent, expression, displaySelector, operators){
    const tokens = expression.match(/(\d+(\.\d+)?|\D)/g);
    const lastValueOnExpression = tokens ? tokens[tokens.length - 1] : '';

    if (textContent == '√' && lastValueOnExpression != '' && (!operators.includes(lastValueOnExpression) || lastValueOnExpression == '%')) {
        alert('Antes da raiz quadrada deve haver um operador! Deve ser diferente de %.');
    } else {
        displaySelector.textContent += textContent;
    }
}

addListenerOnButtons();