function addListenerOnButtons() {
    let buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        let buttonTextValue = button.textContent;

        if (buttonTextValue === '=') {
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

        const result = calculateExpression(expression);

        if (result) {
            display.innerHTML = result % 1 === 0 ? result : result.toFixed(3);
        }
    }
}

function calculateExpression(expression) {
    try {
        return new Function('return ' + expression)();
    } catch (error) {
        alert('Não foi possível realizar cálculo! Verifique a expressão!');
    }
}

function normalizeMultiplicationAndDivision(expression) {
    return expression.replaceAll('×', '*').replaceAll('÷', '/');
}

function normalizeSquareRoot(tokens, operators) {
    let sqrtIndex = tokens.indexOf('√');

    while (sqrtIndex !== -1) {
        tokens[sqrtIndex] = 'Math.sqrt(';

        for (let i = sqrtIndex + 1; i < tokens.length; i++) {
            if (!operators.includes(tokens[i])) {
                tokens[i] += ')';
                break;
            }
        }

        sqrtIndex = tokens.indexOf('√');
    }

    return tokens;
}

function normalizeExpression(expression) {
    const operators = ['√', '%', '×', '÷', '-', '+'];

    expression = normalizeMultiplicationAndDivision(expression);

    let tokens = expression.match(/(\d+(\.\d+)?|\D)/g);

    tokens = normalizeSquareRoot(tokens, operators);

    tokens = normalizePercentage(tokens);

    return tokens.join(" ");
}

function normalizePercentage(tokens) {
    let percentIndex = tokens.indexOf('%');

    if (percentIndex === 1 && tokens.length === 2) {
        tokens.pop();
        tokens[0] /= 100;

        return tokens;
    }

    while (percentIndex !== -1) {
        let previousToken = percentIndex - 2;

        if (previousToken < 0) {
            tokens.splice(percentIndex, 1);
            tokens[0] /= 100;
        } else {
            if (['/', '*'].includes(tokens[percentIndex - 2])) {
                tokens[percentIndex - 1] /= 100;
            } else {
                tokens[percentIndex - 1] = tokens[percentIndex - 3] * tokens[percentIndex - 1] / 100;
            }

            tokens.splice(percentIndex, 1);
        }

        percentIndex = -1;
    }

    return tokens;
}

function putValueOnDisplay(textContent) {
    let display = document.querySelector('.display');
    let expression = display.textContent ? display.textContent : '';
    const operators = ['√', '%', '×', '÷', '-', '+'];
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let clear = ["C", "CE"];

    if (clear.includes(textContent)) {
        clearOrDeleteLastCharacter(textContent, display, expression);
    } else {
        if (expression.length === 0 && !numbers.includes(textContent) && textContent !== '√') {
            alert('A expressão deve começar com um número ou raiz quadrada!');
        } else if (expression.length >= 8) {
            alert('O tamanho máximo para expressão é de 8 caracteres!');
        } else if (textContent === '.') {
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

    if (!operators.includes(lastValueOnExpression) && expression.length <= 6 && lastValueOnExpression.search('\\.') === -1) {
        displaySelector.textContent += '.';
    } else {
        alert('O . só pode ser adicionado após um número e em expressão de no máximo 6 caracteres!');
    }
}

function addNumberToExpression(textContent, displaySelector, expression) {
    let lastValueOnExpression = expression[expression.length - 1];

    if (lastValueOnExpression === '%') {
        alert('Após % deve haver outra operação!');
    } else {
        displaySelector.textContent += textContent;
    }
}

function clearOrDeleteLastCharacter(textContent, displaySelector, expression) {
    if (textContent === 'CE') {
        displaySelector.textContent = expression.substring(0, expression.length - 1);
    } else {
        displaySelector.textContent = ''
    }
}

function addOperatorToExpression(textContent, expression, displaySelector, operators) {
    const tokens = expression?.match(/(\d+(\.\d+)?|\D)/g) || [];
    const lastValue = tokens[tokens.length - 1];

    if (!tokens.length) {
        if (textContent === '√') displaySelector.textContent += textContent;
        else alert('A expressão deve começar com um número ou raiz quadrada!');
        return;
    }

    if (textContent === '√' && (lastValue === '%' || !operators.includes(lastValue))) {
        alert('Antes da raiz quadrada deve haver um operador! Deve ser diferente de %.');
    } else if (!operators.includes(lastValue) || lastValue === '%' || (textContent === '√' && lastValue !== '√')) {
        displaySelector.textContent += textContent;
    }
}

addListenerOnButtons();