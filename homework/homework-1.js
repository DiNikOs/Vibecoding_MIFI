const readline = require('node:readline/promises')

// для категории 
// 1 — 300,
// 2 — 500, 
// 3 — 900.
// Для другой категории возвращает 0.
function ticketPrice(category) {
    switch (category) {
        case 1:
            return 300
        case 2:
            return 500
        case 3:
            return 900
        default:            
            return 0
    }
}

function maxTickets(budget, price) {    
    let count = -1
    while(budget >= 0) {
        count++     
        budget -= price
    }
    return count
}

function printTicketResult(category, budget) {
    const categoryPrice = ticketPrice(category) 
    if (categoryPrice === 0) { 
        console.log('неизвестная категория')    
        return
    }
    const count = maxTickets(budget, categoryPrice) 
    console.log(`Категория ${category}, билет ${categoryPrice} руб., бюджет ${budget} руб.: можно купить ${count} шт.`)
}

function deliveryPrice(distance, total) {
    if(total >= 3000 || distance <= 3) {
        return 0;
    }
    let delivery = 200
    if (distance <= 10) {
        return delivery
    } 
    for(let d = 1; d <= distance - 10; d++) {
        delivery += 25
    }
    return delivery
}

function printDelivery(distance, total) {
    const delivery = deliveryPrice(distance, total)
    console.log(`Расстояние ${distance} км, заказ ${total} руб.: доставка ${delivery} руб`)
}

function printSteps(height) {
    let count = 0   
    for(let steps = 1; steps <= height; steps++) { 
        if(steps > 10) {
            console.log(`Дальше лестница не построена`)
            break
        }        
        if(steps === 4) {
            continue
        }
        count++        
        console.log(`Ступень ${steps}`)
    }
    console.log(`Всего построено: ${count}`)
}

/**
Выберите задачу:
1 — билетная касса
2 — доставка заказа
3 — лестница
Ваш выбор:
 */
async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    console.log('1 — билетная касса, 2 — доставка заказа, 3 — лестница, 0 – завершить')
    const choice = Number(await rl.question('Ваш выбор: '))

    if (choice === 1) {
        category = Number(await rl.question('Категория билета: '))
        budget = Number(await rl.question('Бюджет: '))        
        printTicketResult(category, budget)
    } else if (choice === 2) {   
        distance = Number(await rl.question('Расстояние: '))
        total = Number(await rl.question('Сумма заказа: '))        
        printDelivery(distance, total)       
    } else if (choice === 3) {     
        height = Number(await rl.question('Высота лестницы: '))
        printSteps(height)
    } else {
        console.log('такой задачи нет')
    }

    console.log('Работа завершена') 
    rl.close()
}

main()