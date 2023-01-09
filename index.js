const urlApi = `https://mindicador.cl/api`;
const filterCurrencies = ['dolar', 'euro', 'utm'];
const selectWithCurrencies = document.querySelector('#currency');
const divResult = document.querySelector('#result');
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getCurrencies = async () => {
    try {
        const reqCurrencies = await fetch(urlApi);
        const resData = await reqCurrencies.json();
        const currencyList = filterCurrencies.map((currency) => {
            return {
                code: resData[currency].codigo,
                value: resData[currency].valor,
            };
        });

        currencyList.forEach((localCurrency) => {
            const option = document.createElement('option');
            option.value = localCurrency.value;
            option.text = capitalize(localCurrency.code);
            selectWithCurrencies.appendChild(option);
        });
    } catch (error) {
        alert('Error al obtener el listado')
        console.log(error);
    }
};

const calcResult = (amount, currency) => {
    divResult.innerHTML = `$ ${(amount / currency).toFixed(2)} .-`;
};

const drawChart = async (currency) => {
    try {
        const reqChart = await fetch(`${urlApi}/${currency}`);
        const dataChart = await reqChart.json();


        // Probe con todos los meses jeje

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Currency',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192',
                    tension: 0.1,
                },
            ],
        };
        const config = {
            type: 'line',
            data: data,
        };

        const chartDOM = document.querySelector('#chart');
        new Chart(chartDOM, config);
    } catch (error) {
        alert('Error al obtener la data del gráfico')
    }
};

document.querySelector('#btnConvert').addEventListener('click', () => {
    const amountPesos = document.querySelector('#pesos').value;
    if (amountPesos === '') {
        alert('Debes ingresar una cantidad de pesos');
        return;
    }
    const currencySelected = selectWithCurrencies.value;
    const codeCurrencySelected =
        selectWithCurrencies.options[selectWithCurrencies.selectedIndex].text.toLowerCase();
    calcResult(amountPesos, currencySelected);
    drawChart(currencySelected);
});
getCurrencies();