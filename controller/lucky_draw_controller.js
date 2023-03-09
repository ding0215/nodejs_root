const db = require("../model/database_v2")
const { helper: hlp } = require("../helper/helper");
const { unlock } = require("./credential_controller")

const helper = new hlp();

const total_lottery_amount = 100

// var counter = null

exports.luckydraw_middleware = async function (req, res, next) {
    let info_response = {
        'status': 400,
        'data': [],
        'msg': ''
    }

    if (Object.keys(req.body).length === 0) {
        info_response['msg'] = "Body is empty!";
        return res.status(400).send(info_response);
    }

    if (req.body.user_id === undefined || req.body.user_id === "") {
        info_response['msg'] = "User id is empty!";
        return res.status(400).send(info_response);
    }

    if (req.body.lucky_draw_id === undefined || req.body.lucky_draw_id === "") {
        info_response['msg'] = "Lucky draw id is empty!";
        return res.status(400).send(info_response);
    }

    next();
}

exports.luckydraw = async function (req, res) {

    let info_response = {
        'status': 200,
        'data': [],
        'msg': ''
    }

    const lucky_draw_id = req.body.lucky_draw_id

    const user_id = req.body.user_id

    const unlock_prequisite = {}

    const get_lucky_draw_query = `select * from Lucky_draw where id = ${lucky_draw_id}`

    const lucky_draw_data = await db.raw_query(get_lucky_draw_query)

    const products = JSON.parse(lucky_draw_data[0].product_id)

    // sort array
    products.sort(compare)

    // duplicate array
    let lottery_products = products.map((x) => x)

    lottery_products = generateRequiredData({
        lottery_products: lottery_products
    })


    const result_list = []

    // for (let index = 0; index < 3000; index++) {

    //     const result = await draw({ products: lottery_products, counter: counter })

    //     result_list.push(result.chosen_product.id)

    //     if (result.avail_lottery_product[0].id !== result.chosen_product.id) {
    //         const lucky_draw_record_query = `SELECT * from Lucky_draw_record WHERE lucky_draw_id = ${lucky_draw_id} ORDER BY id DESC LIMIT 1`

    //         const lucky_draw_record = await db.raw_query(lucky_draw_record_query)

    //         counter = lucky_draw_record[0].id
    //     }  

    // }

    try {

        const result = await draw({ products: lottery_products, user_id: user_id, lucky_draw_id: lucky_draw_id })

        info_response.data = result.chosen_product

        info_response.msg = "Draw success"

        return res.status(info_response.status).send(info_response)

    } catch (error) {

        info_response.status = 400

        info_response.msg = "something went wrong"

        return res.status(info_response.status).send(info_response)

    }


}

function generateRequiredData({ lottery_products }) {
    let product_index = 0;

    // generate required data for lucky draw
    for (const product of lottery_products) {
        const last_product_index = lottery_products.length - 1
        product.unlock_prequisite = Math.round((product.quantity * 0.10))

        product.unlocked_status = false

        if (product_index === 0) {
            product.unlocked_status = true
        }


        if (product_index === last_product_index) {
            product.unlock_product = null
        } else {
            product.unlock_product = lottery_products[product_index + 1].id
        }

        if (product.unlock_prequisite < 1) {
            product.unlock_prequisite = 1
        }

        product_index++
    }

    return lottery_products

}

async function draw({ products, lucky_draw_id, user_id }) {
    // let avail_product = []

    // let avail_lottery_product = []

    // const lucky_draw_record_query = `SELECT product_id as id, count(id) as total_product_drawn from Lucky_draw_record WHERE lucky_draw_id = ${lucky_draw_id} AND include = 1 GROUP BY product_id`

    // const lucky_draw_record_query_2 = `SELECT product_id as id, count(id) as total_product_drawn from Lucky_draw_record WHERE lucky_draw_id = ${lucky_draw_id} GROUP BY product_id`

    // const lucky_draw_record = await db.raw_query(lucky_draw_record_query)

    // const lucky_draw_record_2 = await db.raw_query(lucky_draw_record_query_2)

    // // check if the product quantity is 0 
    // for (const product of products) {

    //     const product_record = lucky_draw_record_2.find((x) => x.id === product.id)
    //     let product_drawn_count = 0

    //     if (product_record !== undefined) {
    //         product_drawn_count = product_record.total_product_drawn
    //     }

    //     if (product.quantity > product_drawn_count) {
    //         avail_product.push(product)
    //     }

    // }

    // // add the first product in the array if at least 1 product is available for draw
    // if (avail_product.length > 0) {
    //     avail_lottery_product.push(avail_product[0])
    // }

    // // check whether product meet the unlock condition
    // for (const product of avail_product) {

    //     const product_record = lucky_draw_record.find((x) => x.id === product.id)

    //     let product_drawn_count = 0

    //     if (product_record !== undefined) {
    //         product_drawn_count = product_record.total_product_drawn
    //     }

    //     if (product.unlock_prequisite <= product_drawn_count) {

    //         if (product.unlock_product !== null) {
    //             const unlocked_product = products.find((item, index) => item.id === product.unlock_product)
    //             const unlocked_product_drawn_record = lucky_draw_record.find((x) => x.id === unlocked_product.id)
    //             let unlocked_product_drawn_count = 0

    //             if (unlocked_product_drawn_record !== undefined) {
    //                 unlocked_product_drawn_count = unlocked_product_drawn_record.total_product_drawn
    //             }

    //             if (unlocked_product.quantity > unlocked_product_drawn_count) {
    //                 if (!avail_lottery_product.includes(unlocked_product)) {
    //                     avail_lottery_product.push(unlocked_product)
    //                 }
    //             }

    //         }
    //     }
    // }

    const avail_lottery_product = await generate_available_product_list({ products: products, lucky_draw_id: lucky_draw_id })

    const lottery = generate_lottery({
        products: avail_lottery_product,
    })

    let random_num = generateRandomNumber(lottery.length)

    const chosen_product = lottery[random_num]

    let include = 1

    if (chosen_product.id !== avail_lottery_product[0].id) {
        include = 0
        const update_include_query = `UPDATE Lucky_draw_record SET include = 0 WHERE lucky_draw_id = ${lucky_draw_id}`
        await db.raw_query(update_include_query)
    }

    const insert_draw_record_query = `INSERT INTO Lucky_draw_record (lucky_draw_id, user_id, product_id, previous_list, include, created_by, created_at) VAlUES ('${lucky_draw_id}', '${user_id}', '${chosen_product.id}', '${JSON.stringify(avail_lottery_product)}', '${include}', '${user_id}', '${helper.getCurrentDate()}' )`

    await db.raw_query(insert_draw_record_query)

    return { chosen_product, avail_lottery_product }
}

async function get_in_stock_product_list({ products, lucky_draw_id }) {

    let avail_product = []

    const lucky_draw_record_query = `SELECT product_id as id, count(id) as total_product_drawn from Lucky_draw_record WHERE lucky_draw_id = ${lucky_draw_id} GROUP BY product_id`

    const lucky_draw_record = await db.raw_query(lucky_draw_record_query)

    // check if the product quantity is 0 
    for (const product of products) {

        const product_record = lucky_draw_record.find((x) => x.id === product.id)
        let product_drawn_count = 0

        if (product_record !== undefined) {
            product_drawn_count = product_record.total_product_drawn
        }

        if (product.quantity > product_drawn_count) {
            avail_product.push(product)
        }

    }

    return avail_product

}

async function generate_available_product_list({ products, lucky_draw_id }) {
    let avail_lottery_product = []

    const avail_product = await get_in_stock_product_list({ products: products, lucky_draw_id: lucky_draw_id })

    const lucky_draw_record_query = `SELECT product_id as id, count(id) as total_product_drawn from Lucky_draw_record WHERE lucky_draw_id = ${lucky_draw_id} AND include = 1 GROUP BY product_id`

    const lucky_draw_record = await db.raw_query(lucky_draw_record_query)

    // add the first product in the array if at least 1 product is available for draw
    if (avail_product.length > 0) {
        avail_lottery_product.push(avail_product[0])
    }

    // check whether product meet the unlock condition
    for (const product of avail_product) {

        const product_record = lucky_draw_record.find((x) => x.id === product.id)

        let product_drawn_count = 0

        if (product_record !== undefined) {
            product_drawn_count = product_record.total_product_drawn
        }

        if (product.unlock_prequisite <= product_drawn_count) {

            if (product.unlock_product !== null) {
                const unlocked_product = products.find((item, index) => item.id === product.unlock_product)
                const unlocked_product_drawn_record = lucky_draw_record.find((x) => x.id === unlocked_product.id)
                let unlocked_product_drawn_count = 0

                if (unlocked_product_drawn_record !== undefined) {
                    unlocked_product_drawn_count = unlocked_product_drawn_record.total_product_drawn
                }

                if (unlocked_product.quantity > unlocked_product_drawn_count) {
                    if (!avail_lottery_product.includes(unlocked_product)) {
                        avail_lottery_product.push(unlocked_product)
                    }
                }

            }
        }
    }

    return avail_lottery_product
}

function generate_lottery({ products }) {
    const lottery = []


    for (const product of products) {

        const lottery_amount = product.probability * 100

        for (let index = 0; index < lottery_amount; index++) {
            lottery.push(product)
        }

    }

    const remaining_lottery_slot = total_lottery_amount - lottery.length

    for (let index = 0; index < remaining_lottery_slot; index++) {
        lottery.push(products[0])
    }


    return lottery

}

function compare(a, b) {
    if (a.probability < b.probability) {
        return 1
    }

    if (a.probability > b.probability) {
        return -1
    }

    return 0
}

function generateRandomNumber(maxLimit = 100) {
    let rand = Math.random() * maxLimit;

    rand = Math.floor(rand);

    if (rand === 0) {
        rand = 0
    } else {
        rand -= 1
    }

    return rand;
}